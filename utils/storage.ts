import {TimeRecord} from '@/types';

const STORAGE_KEY = 'timeTracker_records';
const TIMER_STATE_KEY = 'timeTracker_timerState';

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: string | null; // ISO string
  pausedTime: number;
  currentActivity: string;
  isMiscRunning: boolean;
  miscStartTime: string | null; // ISO string
  miscEnabled: boolean;
}

export function saveRecords(records: TimeRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

export function loadRecords(): TimeRecord[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      return parsed.map(
        (record: TimeRecord & {startTime: string; endTime: string}) => ({
          ...record,
          startTime: new Date(record.startTime),
          endTime: new Date(record.endTime),
        })
      );
    }
  }
  return [];
}

export function saveTimerState(state: Partial<TimerState>): void {
  if (typeof window !== 'undefined') {
    const currentState = loadTimerState();
    const defaultState: TimerState = {
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
      isMiscRunning: false,
      miscStartTime: null,
      miscEnabled: false,
    };
    const newState: TimerState = {
      ...defaultState,
      ...currentState,
      ...state,
    };
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(newState));
  }
}

export function loadTimerState(): TimerState | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(TIMER_STATE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as TimerState;
      } catch (e) {
        console.error('Failed to parse timer state:', e);
        return null;
      }
    }
  }
  return null;
}
