export interface TimeRecord {
  id: number;
  activity: string;
  startTime: Date;
  endTime: Date;
  duration: number;
}

export interface TimeStats {
  totalTime: number;
  totalCount: number;
  miscTime: number;
  miscCount: number;
  focusTime: number;
  focusCount: number;
}

export interface ActivityStats {
  name: string;
  duration: number;
  count: number;
  percentage: number;
}
