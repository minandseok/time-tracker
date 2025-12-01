export interface TimeRecord {
  id: number;
  activity: string;
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  currentActivity: string;
  records: TimeRecord[];
}

export type TimerStatus = 'idle' | 'running' | 'paused';
