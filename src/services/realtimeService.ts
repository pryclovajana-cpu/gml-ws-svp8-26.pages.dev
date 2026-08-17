import { PollState, ScaleResponse, TextResponse } from '../types';

const BROADCAST_CHANNEL_NAME = 'gml_workshop_poll_sync_v2';
const STORAGE_KEY_POLL1 = 'gml_poll1_live_state_v2';
const STORAGE_KEY_POLL2 = 'gml_poll2_live_state_v2';

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(state: PollState) => void>> = new Map();

  constructor() {
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

    // Listen to storage events across windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_POLL1) {
          this.notifyListeners('poll1', this.getPollState('poll1'));
        } else if (e.key === STORAGE_KEY_POLL2) {
          this.notifyListeners('poll2', this.getPollState('poll2'));
        }
      });
    }
  }

  private getStorageKey(pollId: string): string {
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

    // STRICTLY EMPTY INITIAL STATE - NO PREFILLED MOCK DATA
    const emptyDefaultState: PollState = {
      textResponses: [],
      scaleResponses: [],
    };

    this.savePollState(pollId, emptyDefaultState);
    return emptyDefaultState;
  }

  private savePollState(pollId: string, state: PollState) {
    const key = this.getStorageKey(pollId);
    localStorage.setItem(key, JSON.stringify(state));
    if (this.channel) {
      this.channel.postMessage({ pollId });
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

    // Immediate callback with current state
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

  /**
   * Calculates Mean, Standard Deviation, and Gaussian Bell Curve points (Scale 1-100)
   */
  public calculateGaussian(values: number[]): {
    mean: number;
    stdDev: number;
    points: { x: number; y: number }[];
    hasData: boolean;
  } {
    if (values.length === 0) {
      return {
        mean: 0,
        stdDev: 0,
        points: [],
        hasData: false,
      };
    }

    const n = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / n) * 10) / 10;

    // Sample Standard Deviation
    let variance = 0;
    if (n > 1) {
      variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    } else {
      variance = 15; // default spread for single vote
    }

    const stdDev = Math.max(2, Math.round(Math.sqrt(variance) * 10) / 10);

    // Generate normal distribution curve points across x in [1, 100]
    const points: { x: number; y: number }[] = [];
    const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));

    for (let x = 1; x <= 100; x += 1) {
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const normalDensity = factor * Math.exp(exponent);
      // Normalized amplitude for responsive SVG height
      const yNormalized = normalDensity * stdDev * 2.5;
      points.push({ x, y: Math.min(1, Math.max(0, yNormalized)) });
    }

    return {
      mean,
      stdDev,
      points,
      hasData: true,
    };
  }
}

export const realtimeService = new RealtimeService();
