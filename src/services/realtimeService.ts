import Peer, { DataConnection } from 'peerjs';
import { PollState, ScaleResponse, TextResponse } from '../types';

const BROADCAST_CHANNEL_NAME = 'gml_workshop_poll_sync_v6';
const STORAGE_KEY_POLL1 = 'gml_poll1_live_state_v6';
const STORAGE_KEY_POLL2 = 'gml_poll2_live_state_v6';
const STORAGE_KEY_LEADERSHIP = 'gml_leadership_feedback_state_v6';

export const PEER_HOST_IDS: Record<string, string> = {
  leadership: 'gml-ws-2026-host-leadership',
  poll1: 'gml-ws-2026-host-poll1',
  poll2: 'gml-ws-2026-host-poll2',
};

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(state: PollState) => void>> = new Map();
  private hostPeers: Map<string, Peer> = new Map();
  private clientPeer: Peer | null = null;

  constructor() {
    // 1. BroadcastChannel for same-device cross-tab communication
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

    // 2. Storage event listener
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

  // Start P2P WebRTC Host listener for a specific poll on the presenter screen
  public startHostListener(pollId: string) {
    if (typeof window === 'undefined') return;
    if (this.hostPeers.has(pollId)) return;

    const hostId = PEER_HOST_IDS[pollId];
    if (!hostId) return;

    try {
      const peer = new Peer(hostId, {
        debug: 0,
      });

      peer.on('open', () => {
        // Host ready
      });

      peer.on('connection', (conn: DataConnection) => {
        conn.on('data', (data: any) => {
          if (!data || typeof data !== 'object') return;

          if (data.type === 'text' && data.text) {
            this.addTextVote(pollId, data.text, data.id);
            try {
              conn.send({ status: 'ok', id: data.id });
            } catch (e) {}
          } else if (data.type === 'scale' && typeof data.value === 'number') {
            this.addScaleVote(pollId, data.value, data.id);
            try {
              conn.send({ status: 'ok', id: data.id });
            } catch (e) {}
          }
        });
      });

      peer.on('error', (err: any) => {
        // If ID is taken (another tab already hosting), destroy gracefully
        if (err.type === 'unavailable-id') {
          // Already running
        }
      });

      this.hostPeers.set(pollId, peer);
    } catch (e) {
      console.error('Failed to initialize Peer host', e);
    }
  }

  // Send vote from mobile phone via P2P WebRTC to presenter host
  public async sendVoteFromMobile(
    pollId: string,
    payload: { type: 'text' | 'scale'; text?: string; value?: number }
  ): Promise<boolean> {
    const hostId = PEER_HOST_IDS[pollId];
    if (!hostId) return false;

    // Save locally on mobile too
    if (payload.type === 'text' && payload.text) {
      this.addTextVote(pollId, payload.text);
    } else if (payload.type === 'scale' && typeof payload.value === 'number') {
      this.addScaleVote(pollId, payload.value);
    }

    return new Promise((resolve) => {
      try {
        if (!this.clientPeer || this.clientPeer.destroyed) {
          this.clientPeer = new Peer({ debug: 0 });
        }

        const sendData = () => {
          if (!this.clientPeer) {
            resolve(true);
            return;
          }
          const conn = this.clientPeer.connect(hostId, { reliable: true });
          const timeout = setTimeout(() => {
            resolve(true);
          }, 3000);

          conn.on('open', () => {
            conn.send({
              ...payload,
              pollId,
              id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
              timestamp: Date.now(),
            });
            clearTimeout(timeout);
            setTimeout(() => {
              conn.close();
              resolve(true);
            }, 300);
          });

          conn.on('error', () => {
            clearTimeout(timeout);
            resolve(true);
          });
        };

        if (this.clientPeer.open) {
          sendData();
        } else {
          this.clientPeer.on('open', () => {
            sendData();
          });
          this.clientPeer.on('error', () => {
            resolve(true);
          });
        }
      } catch (e) {
        resolve(true);
      }
    });
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

    // Default seed states for workshop
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

    // Leadership starts clean (empty)
    return {
      scaleResponses: [],
      textResponses: [],
    };
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

  public addTextVote(pollId: string, text: string, existingId?: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = this.getPollState(pollId);

    // Prevent duplicates
    if (existingId && current.textResponses.some((r) => r.id === existingId)) {
      return;
    }

    const newResponse: TextResponse = {
      id: existingId || Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      text: trimmed,
      timestamp: Date.now(),
    };
    const updated: PollState = {
      ...current,
      textResponses: [newResponse, ...current.textResponses],
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);
  }

  public addScaleVote(pollId: string, value: number, existingId?: string) {
    const clamped = Math.max(1, Math.min(100, Math.round(value)));
    const current = this.getPollState(pollId);

    if (existingId && current.scaleResponses.some((r) => r.id === existingId)) {
      return;
    }

    const newResponse: ScaleResponse = {
      id: existingId || Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      value: clamped,
      timestamp: Date.now(),
    };
    const updated: PollState = {
      ...current,
      scaleResponses: [...current.scaleResponses, newResponse],
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);
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

  public resetVotes(pollId: string) {
    const emptyState: PollState = {
      textResponses: [],
      scaleResponses: [],
    };
    this.savePollState(pollId, emptyState);
    this.notifyListeners(pollId, emptyState);
  }

  public subscribe(pollId: string, callback: (state: PollState) => void): () => void {
    if (!this.listeners.has(pollId)) {
      this.listeners.set(pollId, new Set());
    }
    this.listeners.get(pollId)!.add(callback);

    // Initial state push
    callback(this.getPollState(pollId));

    // Ensure host listener is active
    this.startHostListener(pollId);

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
