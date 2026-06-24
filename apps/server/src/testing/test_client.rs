use fastdeck_server::proto::services::v1::{
    deck_service_client::DeckServiceClient, GetDeckInfoRequest, SwitchProfileRequest,
    TriggerActionRequest, CellCoordinate, StreamDeckUpdatesRequest,
};
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Connecting to FastDeck gRPC server at http://127.0.0.1:50065...");
    let mut client = DeckServiceClient::connect("http://127.0.0.1:50065").await?;
    println!("Connected successfully!");

    // 1. Get Deck Info
    println!("Testing get_deck_info...");
    let response = client.get_deck_info(GetDeckInfoRequest {}).await?;
    let info = response.into_inner();
    let server_info = info.server_info.expect("ServerInfo missing");
    let active_profile = info.active_profile.expect("Active profile missing");
    println!("Server Name: {}", server_info.name);
    println!("Active Profile: {}", active_profile.name);
    assert_eq!(server_info.name, "FastDeck Local Server");
    assert_eq!(active_profile.id, "default");

    // 2. Stream Updates (non-blocking test)
    println!("Testing stream_deck_updates (reading first message)...");
    let mut stream = client.stream_deck_updates(StreamDeckUpdatesRequest {
        client_id: "test-client-1".to_string(),
    }).await?.into_inner();
    if let Some(msg_result) = stream.next().await {
        let msg = msg_result?;
        if let Some(update) = msg.update {
            println!("Received initial stream update: {:?}", update);
        } else {
            panic!("Expected update in stream message");
        }
    }

    // 3. Switch Profile to dev
    println!("Testing switch_profile to 'dev'...");
    let switch_res = client.switch_profile(SwitchProfileRequest {
        profile_id: "dev".to_string(),
    }).await?;
    let res = switch_res.into_inner();
    assert!(res.success, "Profile switch failed: {}", res.error_message);
    println!("Profile switched successfully.");

    // 4. Verify Active Profile is dev
    println!("Verifying active profile is 'dev'...");
    let response_dev = client.get_deck_info(GetDeckInfoRequest {}).await?;
    let info_dev = response_dev.into_inner();
    let active_profile_dev = info_dev.active_profile.expect("Active profile missing");
    assert_eq!(active_profile_dev.id, "dev");
    assert_eq!(active_profile_dev.name, "Developer Profile");
    println!("Profile verification succeeded.");

    // 5. Trigger Action
    println!("Testing trigger_action...");
    let trigger_res = client.trigger_action(TriggerActionRequest {
        trigger: Some(fastdeck_server::proto::services::v1::trigger_action_request::Trigger::Coordinate(
            CellCoordinate { row: 0, col: 0 }
        )),
    }).await?;
    assert!(trigger_res.into_inner().success);
    println!("Action triggered successfully.");

    println!("\nAll gRPC endpoints tested successfully! Server is healthy.");
    Ok(())
}
