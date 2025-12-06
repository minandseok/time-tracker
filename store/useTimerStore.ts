'use client';

import {create} from 'zustand';
import {TimeRecord} from '@/types';
import {
  saveRecords,
  loadRecords,
  saveTimerState,
  loadTimerState,
} from '@/utils/storage';
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

// Load initial state from storage
const loadInitialState = () => {
  const savedState = loadTimerState();
  if (savedState) {
    return {
      isRunning: savedState.isRunning,
      isPaused: savedState.isPaused,
      startTime: savedState.startTime ? new Date(savedState.startTime) : null,
      pausedTime: savedState.pausedTime || 0,
      currentActivity: savedState.currentActivity || '',
      isMiscRunning: savedState.isMiscRunning || false,
      miscStartTime: savedState.miscStartTime
        ? new Date(savedState.miscStartTime)
        : null,
      miscEnabled: savedState.miscEnabled || false,
    };
  }
  return {
    isRunning: false,
    isPaused: false,
    startTime: null,
    pausedTime: 0,
    currentActivity: '',
    isMiscRunning: false,
    miscStartTime: null,
    miscEnabled: false,
  };
};

const initialState = loadInitialState();

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  ...initialState,
  records: [],
  recordToDelete: null,
  showDeleteModal: false,
  showClearAllModal: false,
  showSwitchModal: false,
  showMiscStopModal: false,

  // Actions
  setCurrentActivity: (activity: string) => {
    set({currentActivity: activity});
    saveTimerState({
      currentActivity: activity,
    });
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
    saveTimerState({
      isRunning: true,
      isPaused: false,
      startTime: now.toISOString(),
      pausedTime: 0,
      currentActivity: activity,
      isMiscRunning: false,
      miscStartTime: null,
    });
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
    saveTimerState({
      isPaused: true,
      isRunning: false,
      pausedTime: 0,
      isMiscRunning: shouldStartMisc,
      miscStartTime: shouldStartMisc ? now.toISOString() : null,
    });
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
    saveTimerState({
      isRunning: true,
      isPaused: false,
      startTime: now.toISOString(),
      pausedTime: 0,
      isMiscRunning: false,
      miscStartTime: null,
    });
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
      saveTimerState({
        isMiscRunning: true,
        miscStartTime: now.toISOString(),
      });
    } else {
      saveTimerState({
        isMiscRunning: false,
        miscStartTime: null,
      });
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
    saveTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
    });
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
    saveTimerState({
      isRunning: true,
      isPaused: false,
      startTime: now.toISOString(),
      pausedTime: 0,
      currentActivity: newActivity,
      isMiscRunning: false,
      miscStartTime: null,
    });
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
      saveTimerState({
        isRunning: false,
        isPaused: false,
        startTime: null,
        pausedTime: 0,
        currentActivity: '',
      });
    }

    // Start miscellaneous time
    set({isMiscRunning: true, miscStartTime: now});
    saveTimerState({
      miscEnabled: true,
      isMiscRunning: true,
      miscStartTime: now.toISOString(),
    });
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
    saveTimerState({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
      miscEnabled: false,
      isMiscRunning: false,
      miscStartTime: null,
    });
  },
}));
