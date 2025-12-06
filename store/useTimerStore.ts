'use client';

import {create} from 'zustand';
import {TimeRecord} from '@/types';
import {saveRecords, loadRecords, saveTimerState, loadTimerState} from '@/utils/storage';
import {MISC_ACTIVITY, MIN_DURATION_MS} from '@/utils/statistics';

// Helper functions
const calculateDuration = (
  startTime: Date,
  pausedTime: number,
  isRunning: boolean
): number => {
  if (isRunning) {
    return pausedTime + (new Date().getTime() - startTime.getTime());
  }
  return pausedTime;
};

const createRecord = (
  activity: string,
  duration: number,
  endTime: Date = new Date()
): TimeRecord => ({
  id: Date.now(),
  activity,
  startTime: new Date(endTime.getTime() - duration),
  endTime,
  duration,
});

const saveRecord = (record: TimeRecord, existingRecords: TimeRecord[]) => {
  const newRecords = [record, ...existingRecords];
  saveRecords(newRecords);
  return newRecords;
};

interface TimerStore {
  // State
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  currentActivity: string;
  records: TimeRecord[];
  isMiscRunning: boolean;
  miscStartTime: Date | null;
  miscEnabled: boolean;
  recordToDelete: number | null;
  showDeleteModal: boolean;
  showClearAllModal: boolean;
  showSwitchModal: boolean;
  showMiscStopModal: boolean;

  // Actions
  setCurrentActivity: (activity: string) => void;
  startTimer: (activity: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  deleteRecord: (id: number) => void;
  clearAllRecords: () => void;
  loadRecordsFromStorage: () => void;
  loadTimerStateFromStorage: () => void;
  openDeleteModal: (id: number) => void;
  closeDeleteModal: () => void;
  openClearAllModal: () => void;
  closeClearAllModal: () => void;
  openSwitchModal: () => void;
  closeSwitchModal: () => void;
  switchActivity: (newActivity: string) => void;
  startMiscActivity: () => void;
  openMiscStopModal: () => void;
  closeMiscStopModal: () => void;
  confirmMiscStop: () => void;
}

// Helper function to persist timer state
const persistTimerState = (state: TimerStore) => {
  saveTimerState({
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    startTime: state.startTime,
    pausedTime: state.pausedTime,
    currentActivity: state.currentActivity,
    isMiscRunning: state.isMiscRunning,
    miscStartTime: state.miscStartTime,
    miscEnabled: state.miscEnabled,
  });
};

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  isRunning: false,
  isPaused: false,
  startTime: null,
  pausedTime: 0,
  currentActivity: '',
  records: [],
  recordToDelete: null,
  showDeleteModal: false,
  showClearAllModal: false,
  showSwitchModal: false,
  showMiscStopModal: false,
  isMiscRunning: false,
  miscStartTime: null,
  miscEnabled: false,

  // Actions
  setCurrentActivity: (activity: string) => {
    set({currentActivity: activity});
    persistTimerState({...get(), currentActivity: activity});
  },

  startTimer: (activity: string) => {
    const state = get();
    const now = new Date();

    // Stop and record miscellaneous time if running
    if (state.isMiscRunning && state.miscStartTime) {
      const miscDuration = now.getTime() - state.miscStartTime.getTime();
      if (miscDuration >= MIN_DURATION_MS) {
        const miscRecord = createRecord(MISC_ACTIVITY, miscDuration, now);
        set({records: saveRecord(miscRecord, state.records)});
      }
    }

    set({
      isRunning: true,
      isPaused: false,
      startTime: now,
      pausedTime: 0,
      currentActivity: activity,
      isMiscRunning: false,
      miscStartTime: null,
    });
    persistTimerState(get());
  },

  pauseTimer: () => {
    const state = get();
    if (!state.isRunning || state.isPaused || !state.startTime) return;

    const now = new Date();
    const totalDuration = calculateDuration(
      state.startTime,
      state.pausedTime,
      true
    );

    // Record current activity before pausing
    let updatedRecords = state.records;
    if (totalDuration >= MIN_DURATION_MS) {
      const record = createRecord(state.currentActivity, totalDuration, now);
      updatedRecords = saveRecord(record, updatedRecords);
    }

    // Start miscellaneous time if mode is enabled
    const shouldStartMisc = state.miscEnabled;

    set({
      records: updatedRecords,
      isPaused: true,
      isRunning: false,
      pausedTime: 0, // Reset for new record when resumed
      isMiscRunning: shouldStartMisc,
      miscStartTime: shouldStartMisc ? now : null,
    });
    persistTimerState(get());
  },

  resumeTimer: () => {
    const state = get();
    if (!state.isPaused) return;

    const now = new Date();

    // Record miscellaneous time when resuming (pause ~ resume)
    let updatedRecords = state.records;
    if (state.isMiscRunning && state.miscStartTime) {
      const miscDuration = now.getTime() - state.miscStartTime.getTime();
      if (miscDuration >= MIN_DURATION_MS) {
        const miscRecord = createRecord(MISC_ACTIVITY, miscDuration, now);
        updatedRecords = saveRecord(miscRecord, updatedRecords);
      }
    }

    // Resume activity with new record (pausedTime is already 0)
    set({
      records: updatedRecords,
      isRunning: true,
      isPaused: false,
      startTime: now,
      pausedTime: 0, // Start fresh for new record
      isMiscRunning: false,
      miscStartTime: null,
    });
    persistTimerState(get());
  },

  stopTimer: () => {
    const state = get();
    if (!state.isRunning || !state.startTime) return;

    const now = new Date();
    const totalDuration = calculateDuration(
      state.startTime,
      state.pausedTime,
      true
    );

    if (totalDuration >= MIN_DURATION_MS) {
      const record = createRecord(state.currentActivity, totalDuration, now);
      set({records: saveRecord(record, state.records)});
    }

    const wasMiscEnabled = state.miscEnabled;
    get().resetTimer();

    // Start miscellaneous time if mode is enabled
    if (wasMiscEnabled) {
      set({isMiscRunning: true, miscStartTime: now});
      persistTimerState(get());
    }
  },

  resetTimer: () => {
    set({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
    });
    persistTimerState(get());
  },

  deleteRecord: (id: number) => {
    const newRecords = get().records.filter((r) => r.id !== id);
    set({records: newRecords});
    saveRecords(newRecords);
    get().closeDeleteModal();
  },

  clearAllRecords: () => {
    set({records: []});
    saveRecords([]);
    get().closeClearAllModal();
  },

  loadRecordsFromStorage: () => set({records: loadRecords()}),

  loadTimerStateFromStorage: () => {
    const timerState = loadTimerState();
    if (timerState) {
      set({
        isRunning: timerState.isRunning,
        isPaused: timerState.isPaused,
        startTime: timerState.startTime,
        pausedTime: timerState.pausedTime,
        currentActivity: timerState.currentActivity,
        isMiscRunning: timerState.isMiscRunning,
        miscStartTime: timerState.miscStartTime,
        miscEnabled: timerState.miscEnabled,
      });
    }
  },

  openDeleteModal: (id: number) =>
    set({recordToDelete: id, showDeleteModal: true}),
  closeDeleteModal: () => set({recordToDelete: null, showDeleteModal: false}),
  openClearAllModal: () => set({showClearAllModal: true}),
  closeClearAllModal: () => set({showClearAllModal: false}),

  openSwitchModal: () => set({showSwitchModal: true}),
  closeSwitchModal: () => set({showSwitchModal: false}),

  switchActivity: (newActivity: string) => {
    const state = get();
    if (!state.isRunning || !state.startTime) return;

    const now = new Date();
    const totalDuration = calculateDuration(
      state.startTime,
      state.pausedTime,
      true
    );

    // Record current activity
    if (totalDuration >= MIN_DURATION_MS) {
      const record = createRecord(state.currentActivity, totalDuration, now);
      set({records: saveRecord(record, state.records)});
    }

    // Stop and record miscellaneous time if running
    if (state.isMiscRunning && state.miscStartTime) {
      const miscDuration = now.getTime() - state.miscStartTime.getTime();
      if (miscDuration >= MIN_DURATION_MS) {
        const miscRecord = {
          ...createRecord(MISC_ACTIVITY, miscDuration, now),
          id: Date.now() + 1,
        };
        set({records: saveRecord(miscRecord, get().records)});
      }
    }

    // Start timer with new activity
    set({
      isRunning: true,
      isPaused: false,
      startTime: now,
      pausedTime: 0,
      currentActivity: newActivity,
      isMiscRunning: false,
      miscStartTime: null,
    });
    persistTimerState(get());
  },

  startMiscActivity: () => {
    const state = get();
    if (state.miscEnabled) {
      set({showMiscStopModal: true});
      return;
    }

    const now = new Date();
    set({miscEnabled: true});

    // Record and stop current activity if running
    if ((state.isRunning || state.isPaused) && state.startTime) {
      const totalDuration = calculateDuration(
        state.startTime,
        state.pausedTime,
        state.isRunning
      );

      if (totalDuration >= MIN_DURATION_MS) {
        const record = createRecord(state.currentActivity, totalDuration, now);
        set({records: saveRecord(record, state.records)});
      }

      // Reset activity state
      set({
        isRunning: false,
        isPaused: false,
        startTime: null,
        pausedTime: 0,
        currentActivity: '',
      });
    }

    // Start miscellaneous time
    set({isMiscRunning: true, miscStartTime: now});
    persistTimerState(get());
  },

  openMiscStopModal: () => set({showMiscStopModal: true}),
  closeMiscStopModal: () => set({showMiscStopModal: false}),

  confirmMiscStop: () => {
    const state = get();
    const now = new Date();
    let updatedRecords = state.records;

    // Record current activity if running
    if ((state.isRunning || state.isPaused) && state.startTime) {
      const totalDuration = calculateDuration(
        state.startTime,
        state.pausedTime,
        state.isRunning
      );

      if (totalDuration >= MIN_DURATION_MS) {
        const record = createRecord(state.currentActivity, totalDuration, now);
        updatedRecords = saveRecord(record, updatedRecords);
      }
    }

    // Record miscellaneous time if running
    if (state.isMiscRunning && state.miscStartTime) {
      const miscDuration = now.getTime() - state.miscStartTime.getTime();
      if (miscDuration >= MIN_DURATION_MS) {
        const miscRecord = {
          ...createRecord(MISC_ACTIVITY, miscDuration, now),
          id: Date.now() + 1,
        };
        updatedRecords = saveRecord(miscRecord, updatedRecords);
      }
    }

    // Reset all state
    set({
      records: updatedRecords,
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
      miscEnabled: false,
      isMiscRunning: false,
      miscStartTime: null,
      showMiscStopModal: false,
    });
    persistTimerState(get());
  },
}));
