import { PollState, ScaleResponse, TextResponse } from '../types';

const BROADCAST_CHANNEL_NAME = 'gml_workshop_poll_sync_v4';
const STORAGE_KEY_POLL1 = 'gml_poll1_live_state_v4';
const STORAGE_KEY_POLL2 = 'gml_poll2_live_state_v4';
const STORAGE_KEY_LEADERSHIP = 'gml_leadership_feedback_state_v4';
const NTFY_TOPIC = 'gml_ws_svp8_26_sync_live_v4';
const NTFY_BASE_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

interface SyncMessage {
  type: 'scale' | 'text' | 'reset' | 'delete';
  pollId: string;
  payload?: any;
  timestamp: number;
}

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<(state: PollState) => void>> = new Map();
  private processedMessageIds: Set<string> = new Set();
  private pollIntervalId: any = null;

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

    // 2. Cross-device Internet synchronization via Global SSE (Server-Sent Events) + Robust 2s Polling fallback
    if (typeof window !== 'undefined') {
      if (typeof EventSource !== 'undefined') {
        this.initCloudSSE();
      }
      this.fetchCloudHistory();

      // Reliable 2-second background heartbeat polling
      this.pollIntervalId = setInterval(() => {
        this.fetchCloudHistory();
      }, 2000);

      // Window focus refresh
      window.addEventListener('focus', () => {
        this.fetchCloudHistory();
      });
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
          // Ignore parse errors
        }
      };

      this.eventSource.onerror = () => {
        // Handled by SSE automatic reconnection + polling
      };
    } catch (e) {
      console.warn('Realtime cloud SSE initialization fallback', e);
    }
  }

  // Fetch recent votes from cloud on initial load & heartbeat
  public async fetchCloudHistory() {
    try {
      const response = await fetch(`${NTFY_BASE_URL}/json?poll=1&since=24h`);
      if (response.ok) {
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
          } catch (e) {}
        }
      }
    } catch (e) {}

    try {
      const response2 = await fetch(`${NTFY_BASE_URL}_bk/json?poll=1&since=24h`);
      if (response2.ok) {
        const text = await response2.text();
        const lines = text.trim().split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data && data.message) {
              const syncMsg: SyncMessage = JSON.parse(data.message);
              this.handleIncomingCloudMessage(syncMsg);
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
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
        this.savePollState(pollId, updated);
        this.notifyListeners(pollId, updated);
      }
    } else if (msg.type === 'text' && msg.payload) {
      const exists = currentState.textResponses.some((r) => r.id === msg.payload.id);
      if (!exists) {
        const updated: PollState = {
          ...currentState,
          textResponses: [msg.payload, ...currentState.textResponses],
        };
        this.savePollState(pollId, updated);
        this.notifyListeners(pollId, updated);
      }
    } else if (msg.type === 'delete' && msg.payload) {
      const updated: PollState = {
        ...currentState,
        textResponses: currentState.textResponses.filter((r) => r.id !== msg.payload),
      };
      this.savePollState(pollId, updated);
      this.notifyListeners(pollId, updated);
    } else if (msg.type === 'reset') {
      const emptyState: PollState = {
        textResponses: [],
        scaleResponses: [],
      };
      this.savePollState(pollId, emptyState);
      this.notifyListeners(pollId, emptyState);
    }
  }

  private getStorageKey(pollId: string): string {
    if (pollId === 'poll1') return STORAGE_KEY_POLL1;
    if (pollId === 'poll2') return STORAGE_KEY_POLL2;
    return STORAGE_KEY_LEADERSHIP;
  }

  public getPollState(pollId: string): PollState {
    if (typeof window === 'undefined') {
      return { textResponses: [], scaleResponses: [] };
    }

    const key = this.getStorageKey(pollId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse poll state', e);
      }
    }

    // Default states
    if (pollId === 'poll1') {
      return {
        scaleResponses: [
          { id: '1', value: 85, timestamp: 1 },
          { id: '2', value: 72, timestamp: 2 },
          { id: '3', value: 91, timestamp: 3 },
          { id: '4', value: 68, timestamp: 4 },
          { id: '5', value: 79, timestamp: 5 },
          { id: '6', value: 88, timestamp: 6 },
          { id: '7', value: 64, timestamp: 7 },
          { id: '8', value: 95, timestamp: 8 },
        ],
        textResponses: [
          { id: 't1', text: 'Zkratky jako OVU a KŠK jsou sice užitečné, ale potřebujeme je přeložit do srozumitelného jazyka naší výuky.', timestamp: 1 },
          { id: 't2', text: 'Vnímám příležitost lépe propojit semináře na vyšším gymnáziu se základy z primy až kvarty.', timestamp: 2 },
        ],
      };
    } else if (pollId === 'poll2') {
      return {
        scaleResponses: [
          { id: '1', value: 89, timestamp: 1 },
          { id: '2', value: 94, timestamp: 2 },
          { id: '3', value: 82, timestamp: 3 },
          { id: '4', value: 90, timestamp: 4 },
          { id: '5', value: 96, timestamp: 5 },
        ],
        textResponses: [
          { id: 't1', text: 'Velmi oceňuji zaměření na konkrétní specifika nadaných žáků a práci v předmětových komisích.', timestamp: 1 },
        ],
      };
    }

    // Leadership state starts clean
    return {
      scaleResponses: [],
      textResponses: [],
    };
  }

  public deleteTextVote(pollId: string, id: string) {
    const current = this.getPollState(pollId);
    const updated: PollState = {
      ...current,
      textResponses: current.textResponses.filter((r) => r.id !== id),
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);

    // Broadcast delete to cloud
    const syncMsg: SyncMessage = {
      type: 'delete',
      pollId,
      payload: id,
      timestamp: Date.now(),
    };
    this.publishToCloud(syncMsg);
  }

  private savePollState(pollId: string, state: PollState) {
    const key = this.getStorageKey(pollId);
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
    if (this.channel) {
      this.channel.postMessage({ pollId });
    }
  }

  private publishToCloud(msg: SyncMessage) {
    try {
      const bodyStr = JSON.stringify(msg);
      fetch(NTFY_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: bodyStr,
      }).catch(() => {});

      fetch(`${NTFY_BASE_URL}_bk`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: bodyStr,
      }).catch(() => {});
    } catch (e) {
      // Ignore network errors
    }
  }

  public addTextVote(pollId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = this.getPollState(pollId);
    const newResponse: TextResponse = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
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
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
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

    return {
      hasData: true,
      mean: Math.round(mean * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10,
      points,
      count,
    };
  }
}

export const realtimeService = new RealtimeService();
