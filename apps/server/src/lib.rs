pub mod config;

pub mod proto {
    pub mod services {
        pub mod v1 {
            tonic::include_proto!("fastdeck.services.v1");
        }
    }
}

use dashmap::DashMap;
use futures_util::lock::Mutex as FutureMutex;
use std::fs::File;
use std::io::{Read, Write};
use std::net::SocketAddr;
use std::path::Path;
use std::sync::{Arc, RwLock};
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use tonic::{Request, Response, Status, transport::Server};

use proto::services::v1::{
    Action, ActionType, Cell, CellAction, CreateFolderAction, Grid, LaunchAppAction,
    MediaCommand, MediaControlAction, OpenUrlAction, Profile, RunCommandAction,
    ServerInfo, GetDeckInfoRequest, GetDeckInfoResponse,
    StreamDeckUpdatesRequest, StreamDeckUpdatesResponse,
    TriggerActionRequest, TriggerActionResponse,
    SwitchProfileRequest, SwitchProfileResponse,
    UpdateCellRequest, UpdateCellResponse,
    deck_service_server::{DeckService, DeckServiceServer},
};

const CACHE_FILE_PATH: &str = "profiles_cache.json";

#[derive(serde::Serialize, serde::Deserialize)]
struct CacheData {
    active_profile_id: String,
    profiles: std::collections::HashMap<String, Profile>,
}

fn load_cache() -> (String, DashMap<String, Profile>) {
    let path = Path::new(CACHE_FILE_PATH);
    if path.exists() {
        if let Ok(mut file) = File::open(path) {
            let mut contents = String::new();
            if file.read_to_string(&mut contents).is_ok() {
                if let Ok(cache_data) = serde_json::from_str::<CacheData>(&contents) {
                    let dash_map = DashMap::new();
                    for (k, v) in cache_data.profiles {
                        dash_map.insert(k, v);
                    }
                    tracing::info!("Loaded active profile '{}' and {} profiles from cache file", cache_data.active_profile_id, dash_map.len());
                    return (cache_data.active_profile_id, dash_map);
                }
            }
        }
        tracing::warn!("Failed to load cache from file; resetting to defaults");
    }

    // Default configuration if cache not found/corrupted
    let default_profile = create_default_profile();
    let dev_profile = create_dev_profile();
    let dash_map = DashMap::new();
    dash_map.insert(default_profile.id.clone(), default_profile);
    dash_map.insert(dev_profile.id.clone(), dev_profile);

    let active_id = "default".to_string();
    
    // Save defaults to cache immediately
    let cache_data = CacheData {
        active_profile_id: active_id.clone(),
        profiles: dash_map.iter().map(|ref_val| (ref_val.key().clone(), ref_val.value().clone())).collect(),
    };
    if let Ok(serialized) = serde_json::to_string_pretty(&cache_data) {
        if let Ok(mut file) = File::create(path) {
            let _ = file.write_all(serialized.as_bytes());
        }
    }

    (active_id, dash_map)
}

fn save_cache(active_profile_id: &str, profiles: &DashMap<String, Profile>) {
    let cache_data = CacheData {
        active_profile_id: active_profile_id.to_string(),
        profiles: profiles.iter().map(|ref_val| (ref_val.key().clone(), ref_val.value().clone())).collect(),
    };
    if let Ok(serialized) = serde_json::to_string_pretty(&cache_data) {
        let path = Path::new(CACHE_FILE_PATH);
        // Write asynchronously to prevent blocking the gRPC thread
        tokio::spawn(async move {
            if let Err(err) = tokio::fs::write(path, serialized.as_bytes()).await {
                tracing::error!("Failed to write profile cache to file: {}", err);
            } else {
                tracing::debug!("Saved profile cache successfully");
            }
        });
    }
}

type ClientSender = mpsc::Sender<Result<StreamDeckUpdatesResponse, Status>>;

pub struct MyDeckService {
    active_profile_id: RwLock<String>,
    profiles: DashMap<String, Profile>,
    clients: Arc<FutureMutex<Vec<ClientSender>>>,
}

impl MyDeckService {
    pub fn new() -> Self {
        let (active_id, profiles) = load_cache();

        Self {
            active_profile_id: RwLock::new(active_id),
            profiles,
            clients: Arc::new(FutureMutex::new(Vec::new())),
        }
    }

    async fn broadcast_update(&self, update: proto::services::v1::stream_deck_updates_response::Update) {
        let mut clients = self.clients.lock().await;
        let mut to_remove = Vec::new();

        for (idx, client) in clients.iter().enumerate() {
            let msg = StreamDeckUpdatesResponse {
                update: Some(update.clone()),
            };
            if client.send(Ok(msg)).await.is_err() {
                to_remove.push(idx);
            }
        }

        // Clean up disconnected clients in reverse order
        for idx in to_remove.into_iter().rev() {
            clients.swap_remove(idx);
        }
    }
}

#[tonic::async_trait]
impl DeckService for MyDeckService {
    async fn get_deck_info(
        &self,
        _request: Request<GetDeckInfoRequest>,
    ) -> Result<Response<GetDeckInfoResponse>, Status> {
        let active_id = self.active_profile_id.read().unwrap().clone();
        let active_profile = self.profiles.get(&active_id).map(|ref_val| ref_val.value().clone());

        let server_info = ServerInfo {
            name: "FastDeck Local Server".to_string(),
            version: "0.1.0".to_string(),
            active_profile_id: active_id,
            available_profiles: self.profiles.iter().map(|kv| kv.key().clone()).collect(),
        };

        Ok(Response::new(GetDeckInfoResponse {
            server_info: Some(server_info),
            active_profile,
        }))
    }

    type StreamDeckUpdatesStream = ReceiverStream<Result<StreamDeckUpdatesResponse, Status>>;

    async fn stream_deck_updates(
        &self,
        _request: Request<StreamDeckUpdatesRequest>,
    ) -> Result<Response<Self::StreamDeckUpdatesStream>, Status> {
        let (tx, rx) = mpsc::channel(100);

        // Send initial state to the client immediately
        let active_id = self.active_profile_id.read().unwrap().clone();
        if let Some(profile) = self.profiles.get(&active_id) {
            let initial_msg = StreamDeckUpdatesResponse {
                update: Some(proto::services::v1::stream_deck_updates_response::Update::ActiveProfileUpdate(
                    profile.value().clone(),
                )),
            };
            let _ = tx.send(Ok(initial_msg)).await;
        }

        let mut clients = self.clients.lock().await;
        clients.push(tx);

        Ok(Response::new(ReceiverStream::new(rx)))
    }

    async fn trigger_action(
        &self,
        request: Request<TriggerActionRequest>,
    ) -> Result<Response<TriggerActionResponse>, Status> {
        let req = request.into_inner();
        
        match req.trigger {
            Some(proto::services::v1::trigger_action_request::Trigger::ActionId(id)) => {
                tracing::info!("Triggering action by ID: {}", id);
                Ok(Response::new(TriggerActionResponse {
                    success: true,
                    error_message: String::new(),
                }))
            }
            Some(proto::services::v1::trigger_action_request::Trigger::Coordinate(coord)) => {
                tracing::info!("Triggering action at coordinate: {}, {}", coord.row, coord.col);
                
                let active_id = self.active_profile_id.read().unwrap().clone();
                if let Some(profile) = self.profiles.get(&active_id) {
                    if let Some(grid) = &profile.grid {
                        if let Some(cell) = grid.cells.iter().find(|c| c.row == coord.row && c.col == coord.col) {
                            if cell.is_enabled {
                                if let Some(cell_act) = &cell.action {
                                    match &cell_act.action {
                                        Some(proto::services::v1::cell_action::Action::SingleAction(act)) => {
                                            tracing::info!("Executing Single Action: {} (Type: {:?})", act.name, act.r#type);
                                        }
                                        Some(proto::services::v1::cell_action::Action::MultiAction(multi)) => {
                                            tracing::info!("Executing Multi Action: {} with {} steps", multi.name, multi.steps.len());
                                        }
                                        None => {}
                                    }
                                }
                            }
                        }
                    }
                }

                Ok(Response::new(TriggerActionResponse {
                    success: true,
                    error_message: String::new(),
                }))
            }
            None => Err(Status::invalid_argument("No action trigger specified")),
        }
    }

    async fn switch_profile(
        &self,
        request: Request<SwitchProfileRequest>,
    ) -> Result<Response<SwitchProfileResponse>, Status> {
        let req = request.into_inner();
        
        if self.profiles.contains_key(&req.profile_id) {
            {
                let mut active_id = self.active_profile_id.write().unwrap();
                *active_id = req.profile_id.clone();
            }

            tracing::info!("Switched active profile to: {}", req.profile_id);

            // Save cache
            save_cache(&req.profile_id, &self.profiles);

            // Broadcast the active profile update to all stream subscribers
            if let Some(profile) = self.profiles.get(&req.profile_id) {
                self.broadcast_update(
                    proto::services::v1::stream_deck_updates_response::Update::ActiveProfileUpdate(
                        profile.value().clone(),
                    )
                ).await;
            }

            Ok(Response::new(SwitchProfileResponse {
                success: true,
                error_message: String::new(),
            }))
        } else {
            Ok(Response::new(SwitchProfileResponse {
                success: false,
                error_message: format!("Profile '{}' not found", req.profile_id),
            }))
        }
    }

    async fn update_cell(
        &self,
        request: Request<UpdateCellRequest>,
    ) -> Result<Response<UpdateCellResponse>, Status> {
        let req = request.into_inner();
        
        let profile_id = req.profile_id;
        let Some(cell) = req.cell else {
            return Ok(Response::new(UpdateCellResponse {
                success: false,
                error_message: "No cell configuration provided".to_string(),
            }));
        };

        let mut success = false;
        let mut error_message = String::new();

        if let Some(mut profile) = self.profiles.get_mut(&profile_id) {
            if let Some(grid) = &mut profile.grid {
                if let Some(idx) = grid.cells.iter().position(|c| c.row == cell.row && c.col == cell.col && c.page == cell.page) {
                    grid.cells[idx] = cell.clone();
                } else {
                    grid.cells.push(cell.clone());
                }
                success = true;
            } else {
                error_message = "Profile grid is missing".to_string();
            }
        } else {
            error_message = format!("Profile '{}' not found", profile_id);
        }

        if success {
            save_cache(&profile_id, &self.profiles);

            // Broadcast the cell update to all stream subscribers
            self.broadcast_update(
                proto::services::v1::stream_deck_updates_response::Update::CellUpdate(cell),
            ).await;
        }

        Ok(Response::new(UpdateCellResponse {
            success,
            error_message,
        }))
    }
}

fn create_default_profile() -> Profile {
    let mut cells = Vec::new();

    // Cell (0, 0): Launch App (Terminal)
    cells.push(Cell {
        row: 0,
        col: 0,
        label: "Terminal".to_string(),
        icon: "💻".to_string(),
        background: "#2e3440".to_string(),
        action: Some(CellAction {
            action: Some(proto::services::v1::cell_action::Action::SingleAction(Action {
                id: "launch_terminal".to_string(),
                name: "Launch Terminal".to_string(),
                r#type: ActionType::LaunchApp as i32,
                action_details: Some(proto::services::v1::action::ActionDetails::LaunchApp(
                    LaunchAppAction {
                        path_or_name: "Terminal".to_string(),
                        args: vec![],
                    },
                )),
            })),
        }),
        is_enabled: true,
    });

    // Cell (0, 1): Open URL (GitHub)
    cells.push(Cell {
        row: 0,
        col: 1,
        label: "GitHub".to_string(),
        icon: "🌐".to_string(),
        background: "#181717".to_string(),
        action: Some(CellAction {
            action: Some(proto::services::v1::cell_action::Action::SingleAction(Action {
                id: "open_github".to_string(),
                name: "Open GitHub".to_string(),
                r#type: ActionType::OpenUrl as i32,
                action_details: Some(proto::services::v1::action::ActionDetails::OpenUrl(
                    OpenUrlAction {
                        url: "https://github.com".to_string(),
                    },
                )),
            })),
        }),
        is_enabled: true,
    });

    // Cell (0, 2): Media Play/Pause
    cells.push(Cell {
        row: 0,
        col: 2,
        label: "Play/Pause".to_string(),
        icon: "⏯️".to_string(),
        background: "#bf616a".to_string(),
        action: Some(CellAction {
            action: Some(proto::services::v1::cell_action::Action::SingleAction(Action {
                id: "media_play_pause".to_string(),
                name: "Play or Pause".to_string(),
                r#type: ActionType::MediaControl as i32,
                action_details: Some(proto::services::v1::action::ActionDetails::MediaControl(
                    MediaControlAction {
                        command: MediaCommand::PlayPause as i32,
                    },
                )),
            })),
        }),
        is_enabled: true,
    });

    // Cell (1, 0): Run Command
    cells.push(Cell {
        row: 1,
        col: 0,
        label: "Say Hello".to_string(),
        icon: "👋".to_string(),
        background: "#a3be8c".to_string(),
        action: Some(CellAction {
            action: Some(proto::services::v1::cell_action::Action::SingleAction(Action {
                id: "run_hello".to_string(),
                name: "Run Echo Hello".to_string(),
                r#type: ActionType::RunCommand as i32,
                action_details: Some(proto::services::v1::action::ActionDetails::RunCommand(
                    RunCommandAction {
                        command: "echo 'Hello from FastDeck!'".to_string(),
                    },
                )),
            })),
        }),
        is_enabled: true,
    });

    Profile {
        id: "default".to_string(),
        name: "Default Profile".to_string(),
        grid: Some(Grid {
            rows: 3,
            cols: 5,
            cells,
        }),
    }
}

fn create_dev_profile() -> Profile {
    let mut cells = Vec::new();

    // Cell (0, 0): Create Folder
    cells.push(Cell {
        row: 0,
        col: 0,
        label: "Create Dir".to_string(),
        icon: "📁".to_string(),
        background: "#4c566a".to_string(),
        action: Some(CellAction {
            action: Some(proto::services::v1::cell_action::Action::SingleAction(Action {
                id: "create_dir".to_string(),
                name: "Create Demo Dir".to_string(),
                r#type: ActionType::CreateFolder as i32,
                action_details: Some(proto::services::v1::action::ActionDetails::CreateFolder(
                    CreateFolderAction {
                        path: "~/fastdeck-demo".to_string(),
                    },
                )),
            })),
        }),
        is_enabled: true,
    });

    Profile {
        id: "dev".to_string(),
        name: "Developer Profile".to_string(),
        grid: Some(Grid {
            rows: 3,
            cols: 5,
            cells,
        }),
    }
}

pub async fn run_server(addr: SocketAddr) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let my_service = MyDeckService::new();
    let service_server = DeckServiceServer::new(my_service);
    let web_service = tonic_web::enable(service_server);

    tracing::info!("FastDeck gRPC/gRPC-Web server listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .add_service(web_service)
        .serve(addr)
        .await?;

    Ok(())
}
