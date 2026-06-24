import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { DeckService } from './gen/deck_connect';
import { Room, Peer, MeshMode, Cell } from './types';

export let API_BASE_URL =
  localStorage.getItem('fastdeck_api_url') ||
  process.env.REACT_APP_API_URL ||
  'http://127.0.0.1:50065';

let transport = createGrpcWebTransport({
  baseUrl: API_BASE_URL,
});

export let grpcClient = createPromiseClient(DeckService, transport);

export function setApiBaseUrl(url: string) {
  API_BASE_URL = url;
  localStorage.setItem('fastdeck_api_url', url);
  transport = createGrpcWebTransport({
    baseUrl: url,
  });
  grpcClient = createPromiseClient(DeckService, transport);
}

export const apiClient = {
  checkHealth: async () => {
    try {
      await grpcClient.getDeckInfo({});
      return { status: 'ok' };
    } catch (e) {
      return { status: 'error' };
    }
  },

  getDeckInfo: () => grpcClient.getDeckInfo({}),

  triggerAction: (row: number, col: number) =>
    grpcClient.triggerAction({
      trigger: {
        case: 'coordinate',
        value: { row, col },
      },
    }),

  switchProfile: (profileId: string) =>
    grpcClient.switchProfile({ profileId }),

  updateCell: (profileId: string, cell: Cell) =>
    grpcClient.updateCell({ profileId, cell }),

  streamDeckUpdates: (clientId: string) =>
    grpcClient.streamDeckUpdates({ clientId }),

  // Deprecated/Legacy Mesh methods for Dashboard compatibility:
  createRoom: async (name: string, mode: MeshMode, hostPeerId: string, maxNodes?: number): Promise<Room> => {
    return {
      id: 'mock-room',
      name,
      mode,
      host_peer_id: hostPeerId,
      created_at: new Date().toISOString(),
      max_nodes: maxNodes || 10,
    };
  },
  listRooms: async (): Promise<Room[]> => [],
  getRoom: async (id: string): Promise<{ room: Room; peers: Peer[] }> => ({
    room: {
      id,
      name: 'Mock Room',
      mode: 'sfu',
      host_peer_id: 'mock-host',
      created_at: new Date().toISOString(),
      max_nodes: 10,
    },
    peers: [],
  }),
  deleteRoom: async (id: string) => ({ success: true }),
  getTopology: async (id: string) => ({ edges: [] }),
  reportRtt: async (id: string, fromPeerId: string, toPeerId: string, rttMs: number) => ({ success: true }),
  getSignalingWsUrl: (roomId: string) => 'ws://127.0.0.1:50065/ws/signaling',
  getSfuWsUrl: (roomId: string) => 'ws://127.0.0.1:50065/ws/sfu',
  getSyncWsUrl: (roomId: string) => 'ws://127.0.0.1:50065/ws/sync',
};

export type ApiClient = typeof apiClient;
