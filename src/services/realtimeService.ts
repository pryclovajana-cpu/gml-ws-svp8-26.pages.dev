import { PollState, ScaleResponse, TextResponse } from '../types';

const BROADCAST_CHANNEL_NAME = 'gml_workshop_poll_sync_v5';
const STORAGE_KEY_POLL1 = 'gml_poll1_live_state_v5';
const STORAGE_KEY_POLL2 = 'gml_poll2_live_state_v5';
const STORAGE_KEY_LEADERSHIP = 'gml_leadership_feedback_state_v5';

const CLOUD_CONTAINERS: Record<string, string> = {
  leadership: 'ff8081819ff5b11001a01640eb8c46fb',
  poll1: 'ff8081819ff5b11001a01640eca946fc',
  poll2: 'ff8081819ff5b11001a01640edab46fd',
};

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(state: PollState) => void>> = new Map();
  private pollIntervalId: any = null;
  private isSyncing = false;

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

    // 2. Global Cloud Sync: Fast 1.5s Polling loop across all devices
    if (typeof window !== 'undefined') {
      this.fetchCloudHistory();

      this.pollIntervalId = setInterval(() => {
        this.fetchCloudHistory();
      }, 1500);

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

  // Fetch latest state from cloud for all polls
  public async fetchCloudHistory() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    for (const pollId of ['leadership', 'poll1', 'poll2']) {
      const containerId = CLOUD_CONTAINERS[pollId];
      if (!containerId) continue;

      try {
        const res = await fetch(`https://api.restful-api.dev/objects/${containerId}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const cloudText: TextResponse[] = json.data.textResponses || [];
            const cloudScale: ScaleResponse[] = json.data.scaleResponses || [];
            const local = this.getPollState(pollId);

            // Merge items
            const textMap = new Map<string, TextResponse>();
            // Keep order: newer first
            [...cloudText, ...local.textResponses].forEach((item) => {
              if (item && item.id && !textMap.has(item.id)) {
                textMap.set(item.id, item);
              }
            });

            const scaleMap = new Map<string, ScaleResponse>();
            [...cloudScale, ...local.scaleResponses].forEach((item) => {
              if (item && item.id && !scaleMap.has(item.id)) {
                scaleMap.set(item.id, item);
              }
            });

            const merged: PollState = {
              textResponses: Array.from(textMap.values()).sort((a, b) => b.timestamp - a.timestamp),
              scaleResponses: Array.from(scaleMap.values()),
            };

            const localCount = local.textResponses.length + local.scaleResponses.length;
            const mergedCount = merged.textResponses.length + merged.scaleResponses.length;

            if (mergedCount !== localCount || JSON.stringify(local) !== JSON.stringify(merged)) {
              this.savePollState(pollId, merged);
              this.notifyListeners(pollId, merged);
            }
          }
        }
      } catch (e) {
        // Ignore background network blips
      }
    }

    this.isSyncing = false;
  }

  private async pushPollStateToCloud(pollId: string, state: PollState) {
    const containerId = CLOUD_CONTAINERS[pollId];
    if (!containerId) return;

    try {
      await fetch(`https://api.restful-api.dev/objects/${containerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `gml_state_${pollId}_v1`,
          data: {
            textResponses: state.textResponses,
            scaleResponses: state.scaleResponses,
            lastUpdated: Date.now(),
          },
        }),
      });
    } catch (e) {
      console.error('Failed to push state to cloud', e);
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

  private savePollState(pollId: string, state: PollState) {
    const key = this.getStorageKey(pollId);
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
    if (this.channel) {
      this.channel.postMessage({ pollId });
    }
  }

  public async addTextVote(pollId: string, text: string) {
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

    // Push directly to cloud container
    await this.pushPollStateToCloud(pollId, updated);
  }

  public async addScaleVote(pollId: string, value: number) {
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

    // Push directly to cloud container
    await this.pushPollStateToCloud(pollId, updated);
  }

  public async deleteTextVote(pollId: string, id: string) {
    const current = this.getPollState(pollId);
    const updated: PollState = {
      ...current,
      textResponses: current.textResponses.filter((r) => r.id !== id),
    };
    this.savePollState(pollId, updated);
    this.notifyListeners(pollId, updated);

    await this.pushPollStateToCloud(pollId, updated);
  }

  public async resetVotes(pollId: string) {
    const emptyState: PollState = {
      textResponses: [],
      scaleResponses: [],
    };
    this.savePollState(pollId, emptyState);
    this.notifyListeners(pollId, emptyState);

    await this.pushPollStateToCloud(pollId, emptyState);
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
