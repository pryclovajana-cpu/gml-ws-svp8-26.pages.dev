import { PollState, ScaleResponse, TextResponse } from '../types';

const BROADCAST_CHANNEL_NAME = 'gml_workshop_poll_sync_v3';
const STORAGE_KEY_POLL1 = 'gml_poll1_live_state_v3';
const STORAGE_KEY_POLL2 = 'gml_poll2_live_state_v3';
const STORAGE_KEY_LEADERSHIP = 'gml_leadership_feedback_state_v3';
const NTFY_TOPIC = 'gml_ws_svp8_26_sync_live';
const NTFY_BASE_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

interface SyncMessage {
  type: 'scale' | 'text' | 'reset';
  pollId: string;
  payload?: any;
  timestamp: number;
}

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(state: PollState) => void>> = new Map();
  private processedMessageIds: Set<string> = new Set();

  constructor() {
    // 1. Local tab/window synchronization (BroadcastChannel)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        if (event.data && event.data.pollId) {
          const pollId = event.data.pollId;
          const state = this.getPollState(pollId);
          this.notifyListeners(pollId, state);
        }
      };
    }

    // 2. Cross-device Internet synchronization via Global SSE (Server-Sent Events)
    if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
      this.initCloudSSE();
      this.fetchCloudHistory();
    }

    // 3. Local storage listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_POLL1) {
          this.notifyListeners('poll1', this.getPollState('poll1'));
        } else if (e.key === STORAGE_KEY_POLL2) {
          this.notifyListeners('poll2', this.getPollState('poll2'));
        } else if (e.key === STORAGE_KEY_LEADERSHIP) {
          this.notifyListeners('leadership', this.getPollState('leadership'));
        }
      });
    }
  }

  private initCloudSSE() {
    try {
      if (this.eventSource) {
        this.eventSource.close();
      }
      this.eventSource = new EventSource(`${NTFY_BASE_URL}/sse`);
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.message) {
            const syncMsg: SyncMessage = JSON.parse(data.message);
            this.handleIncomingCloudMessage(syncMsg);
          }
        } catch (e) {
          // Ignore parse errors from system messages
        }
      };

      this.eventSource.onerror = () => {
        // SSE handles reconnection automatically
      };
    } catch (e) {
      console.warn('Realtime cloud SSE initialization fallback', e);
    }
  }

  // Fetch recent votes from cloud on initial load
  private async fetchCloudHistory() {
    try {
      const response = await fetch(`${NTFY_BASE_URL}/json?poll=1&since=24h`);
      if (!response.ok) return;
      const text = await response.text();
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data && data.message) {
            const syncMsg: SyncMessage = JSON.parse(data.message);
            this.handleIncomingCloudMessage(syncMsg);
          }
        } catch (e) {
          // Ignore line parse error
        }
      }
    } catch (e) {
      // Offline fallback to local state
    }
  }

  private handleIncomingCloudMessage(msg: SyncMessage) {
    if (!msg || !msg.pollId) return;
    const msgId = `${msg.type}_${msg.pollId}_${msg.timestamp}_${JSON.stringify(msg.payload || '')}`;
    if (this.processedMessageIds.has(msgId)) return;
    this.processedMessageIds.add(msgId);

    const pollId = msg.pollId;
    const currentState = this.getPollState(pollId);

    if (msg.type === 'scale' && msg.payload) {
      const exists = currentState.scaleResponses.some((r) => r.id === msg.payload.id);
      if (!exists) {
        const updated: PollState = {
          ...currentState,
          scaleResponses: [...currentState.scaleResponses, msg.payload],
        };
        this.savePollState(pollId, updated, false);
        this.notifyListeners(pollId, updated);
      }
    } else if (msg.type === 'text' && msg.payload) {
      const exists = currentState.textResponses.some((r) => r.id === msg.payload.id);
      if (!exists) {
        const updated: PollState = {
          ...currentState,
          textResponses: [msg.payload, ...currentState.textResponses],
        };
        this.savePollState(pollId, updated, false);
        this.notifyListeners(pollId, updated);
      }
    } else if (msg.type === 'reset') {
      const emptyState: PollState = {
        textResponses: [],
        scaleResponses: [],
      };
      this.savePollState(pollId, emptyState, false);
      this.notifyListeners(pollId, emptyState);
    }
  }

  private getStorageKey(pollId: string): string {
    if (pollId === 'leadership') return STORAGE_KEY_LEADERSHIP;
    return pollId === 'poll2' ? STORAGE_KEY_POLL2 : STORAGE_KEY_POLL1;
  }

  public getPollState(pollId: string): PollState {
    const key = this.getStorageKey(pollId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing poll state', e);
      }
    }

    const emptyDefaultState: PollState = {
      textResponses: [],
      scaleResponses: [],
    };

    return emptyDefaultState;
  }

  public deleteTextVote(pollId: string, id: string) {
    const current = this.getPollState(pollId);
    const updated: PollState = {
      ...current,
      textResponses: current.textResponses.filter((r) => r.id !== id),
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);
  }

  private savePollState(pollId: string, state: PollState, broadcastToCloud = true) {
    const key = this.getStorageKey(pollId);
    localStorage.setItem(key, JSON.stringify(state));
    if (this.channel) {
      this.channel.postMessage({ pollId });
    }
  }

  private publishToCloud(msg: SyncMessage) {
    try {
      fetch(NTFY_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      }).catch(() => {
        // Non-blocking network fallback
      });
    } catch (e) {
      // Ignore network errors
    }
  }

  public addTextVote(pollId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = this.getPollState(pollId);
    const newResponse: TextResponse = {
      id: Math.random().toString(36).substring(2, 9),
      text: trimmed,
      timestamp: Date.now(),
    };
    const updated: PollState = {
      ...current,
      textResponses: [newResponse, ...current.textResponses],
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);

    // Broadcast across all devices via Cloud
    const syncMsg: SyncMessage = {
      type: 'text',
      pollId,
      payload: newResponse,
      timestamp: Date.now(),
    };
    this.publishToCloud(syncMsg);
  }

  public addScaleVote(pollId: string, value: number) {
    const clamped = Math.max(1, Math.min(100, Math.round(value)));
    const current = this.getPollState(pollId);
    const newResponse: ScaleResponse = {
      id: Math.random().toString(36).substring(2, 9),
      value: clamped,
      timestamp: Date.now(),
    };
    const updated: PollState = {
      ...current,
      scaleResponses: [...current.scaleResponses, newResponse],
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);

    // Broadcast across all devices via Cloud
    const syncMsg: SyncMessage = {
      type: 'scale',
      pollId,
      payload: newResponse,
      timestamp: Date.now(),
    };
    this.publishToCloud(syncMsg);
  }

  public resetVotes(pollId: string) {
    const emptyState: PollState = {
      textResponses: [],
      scaleResponses: [],
    };
    this.savePollState(pollId, emptyState);
    this.notifyListeners(pollId, emptyState);

    // Broadcast reset to all phones and presentation screens
    const syncMsg: SyncMessage = {
      type: 'reset',
      pollId,
      timestamp: Date.now(),
    };
    this.publishToCloud(syncMsg);
  }

  public subscribe(pollId: string, callback: (state: PollState) => void): () => void {
    if (!this.listeners.has(pollId)) {
      this.listeners.set(pollId, new Set());
    }
    this.listeners.get(pollId)!.add(callback);

    // Initial state push
    callback(this.getPollState(pollId));

    return () => {
      const set = this.listeners.get(pollId);
      if (set) {
        set.delete(callback);
      }
    };
  }

  private notifyListeners(pollId: string, state: PollState) {
    const set = this.listeners.get(pollId);
    if (set) {
      set.forEach((cb) => cb(state));
    }
  }

  public calculateGaussian(values: number[]): {
    hasData: boolean;
    mean: number;
    stdDev: number;
    points: { x: number; y: number }[];
    count: number;
  } {
    if (values.length === 0) {
      return { hasData: false, mean: 50, stdDev: 15, points: [], count: 0 };
    }

    const count = values.length;
    const mean = values.reduce((sum, v) => sum + v, 0) / count;

    let variance = 0;
    if (count > 1) {
      const sumSq = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);
      variance = sumSq / (count - 1);
    } else {
      variance = 100;
    }
    const stdDev = Math.max(8, Math.sqrt(variance));

    const points: { x: number; y: number }[] = [];
    const step = 2;
    for (let x = 0; x <= 100; x += step) {
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      points.push({ x, y });
    }

    const maxY = Math.max(...points.map((p) => p.y), 0.0001);
    const normalizedPoints = points.map((p) => ({
      x: p.x,
      y: (p.y / maxY) * 100,
    }));

    return {
      hasData: true,
      mean: Math.round(mean * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10,
      points: normalizedPoints,
      count,
    };
  }
}

export const realtimeService = new RealtimeService();
