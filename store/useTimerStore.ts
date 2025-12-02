'use client';

import {create} from 'zustand';
import {TimeRecord} from '@/types';
import {saveRecords, loadRecords} from '@/utils/storage';

interface TimerStore {
  // State
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  currentActivity: string;
  records: TimeRecord[];
  recordToDelete: number | null;
  showDeleteModal: boolean;
  showClearAllModal: boolean;
  showManualAddModal: boolean;

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
  openManualAddModal: () => void;
  closeManualAddModal: () => void;
  addManualRecord: (
    activity: string,
    startTime: Date,
    endTime: Date,
    duration: number
  ) => void;
}

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
  showManualAddModal: false,

  // Actions
  setCurrentActivity: (activity: string) => {
    set({currentActivity: activity});
  },

  startTimer: (activity: string) => {
    set({
      isRunning: true,
      isPaused: false,
      startTime: new Date(),
      pausedTime: 0,
      currentActivity: activity,
    });
  },

  pauseTimer: () => {
    const state = get();
    if (!state.isRunning || state.isPaused || !state.startTime) return;

    const newPausedTime =
      state.pausedTime + (new Date().getTime() - state.startTime.getTime());
    set({
      isPaused: true,
      isRunning: false,
      pausedTime: newPausedTime,
    });
  },

  resumeTimer: () => {
    const state = get();
    if (!state.isPaused) return;

    set({
      isRunning: true,
      isPaused: false,
      startTime: new Date(),
    });
  },

  stopTimer: () => {
    const state = get();
    if (!state.isRunning && !state.isPaused) return;

    const endTime = new Date();
    let totalDuration: number;

    if (state.isRunning && state.startTime) {
      totalDuration =
        state.pausedTime + (endTime.getTime() - state.startTime.getTime());
    } else {
      totalDuration = state.pausedTime;
    }

    // Only save if duration is at least 1 second
    if (totalDuration >= 1000) {
      const record: TimeRecord = {
        id: Date.now(),
        activity: state.currentActivity,
        startTime: new Date(endTime.getTime() - totalDuration),
        endTime: endTime,
        duration: totalDuration,
      };

      const newRecords = [record, ...state.records];
      set({records: newRecords});
      saveRecords(newRecords);
    }

    get().resetTimer();
  },

  resetTimer: () => {
    set({
      isRunning: false,
      isPaused: false,
      startTime: null,
      pausedTime: 0,
      currentActivity: '',
    });
  },

  deleteRecord: (id: number) => {
    const state = get();
    const newRecords = state.records.filter((record) => record.id !== id);
    set({records: newRecords});
    saveRecords(newRecords);
    get().closeDeleteModal();
  },

  clearAllRecords: () => {
    set({records: []});
    saveRecords([]);
    get().closeClearAllModal();
  },

  loadRecordsFromStorage: () => {
    const records = loadRecords();
    set({records});
  },

  openDeleteModal: (id: number) => {
    set({recordToDelete: id, showDeleteModal: true});
  },

  closeDeleteModal: () => {
    set({recordToDelete: null, showDeleteModal: false});
  },

  openClearAllModal: () => {
    set({showClearAllModal: true});
  },

  closeClearAllModal: () => {
    set({showClearAllModal: false});
  },

  openManualAddModal: () => {
    set({showManualAddModal: true});
  },

  closeManualAddModal: () => {
    set({showManualAddModal: false});
  },

  addManualRecord: (
    activity: string,
    startTime: Date,
    endTime: Date,
    duration: number
  ) => {
    const state = get();
    const record: TimeRecord = {
      id: Date.now(),
      activity,
      startTime,
      endTime,
      duration,
    };

    const newRecords = [record, ...state.records];
    set({records: newRecords});
    saveRecords(newRecords);
  },
}));
