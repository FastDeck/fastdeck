export class MeshConnection {
  roomId: string;
  myPeerId: string;

  onSignalingStatusChanged?: (status: 'disconnected' | 'connecting' | 'connected') => void;
  onPeersUpdated?: (peers: any[]) => void;
  onTopologyAssigned?: (parent: string | null) => void;
  onPeerLeft?: (peerId: string) => void;
  onError?: (msg: string) => void;

  onTimeSyncStatusChanged?: (status: 'disconnected' | 'active') => void;
  onTimeSyncUpdated?: (stats: { offsetUs: number; rttMs: number }) => void;

  onSfuStatusChanged?: (status: 'disconnected' | 'connected') => void;
  onSfuAudioFrame?: (data: ArrayBuffer) => void;

  constructor(roomId: string, myPeerId: string) {
    this.roomId = roomId;
    this.myPeerId = myPeerId;
  }

  connectSignaling(displayName: string, deviceType: string, connectionType: string) {
    setTimeout(() => {
      this.onSignalingStatusChanged?.('connected');
      this.onPeersUpdated?.([
        {
          id: this.myPeerId,
          display_name: displayName,
          device_type: deviceType,
          connection_type: connectionType,
          joined_at: new Date().toISOString(),
        }
      ]);
    }, 100);
  }

  connectTimeSync(intervalMs: number) {
    setTimeout(() => {
      this.onTimeSyncStatusChanged?.('active');
      this.onTimeSyncUpdated?.({ offsetUs: 0, rttMs: 5 });
    }, 200);
  }

  connectSfu(role: 'host' | 'client') {
    setTimeout(() => {
      this.onSfuStatusChanged?.('connected');
    }, 300);
  }

  sendSfuAudioFrame(buf: ArrayBuffer): boolean {
    return true;
  }

  disconnectAll() {
    this.onSignalingStatusChanged?.('disconnected');
    this.onTimeSyncStatusChanged?.('disconnected');
    this.onSfuStatusChanged?.('disconnected');
  }
}
