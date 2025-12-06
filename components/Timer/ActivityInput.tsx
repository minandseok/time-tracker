'use client';

import {useTimerStore} from '@/store/useTimerStore';
import {KeyboardEvent, useState, useRef, useEffect, useMemo} from 'react';
import {getActivityColor} from '@/utils/colorUtils';

export default function ActivityInput() {
  const {
    currentActivity,
    setCurrentActivity,
    startTimer,
    isRunning,
    isPaused,
    miscEnabled,
    records,
  } = useTimerStore();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const justClickedSuggestionRef = useRef(false);

  // Existing activity list (recent first, deduplicated, excluding miscellaneous)
  const activities = useMemo(() => {
    const uniqueActivities = Array.from(
      new Set(records.map((r) => r.activity))
    ).filter((a) => a !== '잡동사니');
    return uniqueActivities.reverse(); // Most recent first
  }, [records]);

  // Filtered suggestion list
  const filteredSuggestions = useMemo(() => {
    if (!currentActivity.trim()) return activities;
    return activities.filter((activity) =>
      activity.toLowerCase().includes(currentActivity.toLowerCase())
    );
  }, [currentActivity, activities]);

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      if (
        e.key === 'Enter' &&
        !isRunning &&
        !isPaused &&
        currentActivity.trim() &&
        miscEnabled
      ) {
        startTimer(currentActivity);
        setShowSuggestions(false);
        setCurrentActivity(''); // Clear input after starting timer
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = filteredSuggestions[selectedIndex];
          setShowSuggestions(false);
          setSelectedIndex(-1);
          if (miscEnabled && !isRunning && !isPaused) {
            startTimer(selected);
            setCurrentActivity(''); // Clear input after starting timer
          }
        } else if (
          currentActivity.trim() &&
          miscEnabled &&
          !isRunning &&
          !isPaused
        ) {
          startTimer(currentActivity);
          setShowSuggestions(false);
          setCurrentActivity(''); // Clear input after starting timer
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (activity: string) => {
    setCurrentActivity(activity);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    justClickedSuggestionRef.current = true;
    inputRef.current?.focus();
    // Reset flag after a short delay to allow normal focus behavior next time
    setTimeout(() => {
      justClickedSuggestionRef.current = false;
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentActivity(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    // Don't auto-open suggestions if user just clicked a suggestion
    if (justClickedSuggestionRef.current) {
      return;
    }
    if (activities.length > 0) {
      setShowSuggestions(true);
    }
  };

  const isDisabled = isRunning || isPaused || !miscEnabled;
  const placeholder = miscEnabled
    ? '활동 이름 (예: 공부, 운동, 독서)'
    : '잡동사니를 먼저 시작하세요';

  return (
    <div className='mb-8 relative'>
      <input
        ref={inputRef}
        type='text'
        value={currentActivity}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        disabled={isDisabled}
        placeholder={placeholder}
        className='w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-base font-normal bg-white transition-all duration-300 outline-none focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(96,165,250,0.1)] disabled:opacity-50 disabled:cursor-not-allowed'
      />

      {/* 자동완성 제안 목록 */}
      {showSuggestions && !isDisabled && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className='absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
          {filteredSuggestions.map((activity, index) => (
            <div
              key={activity}
              onClick={() => handleSuggestionClick(activity)}
              className={`px-5 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              } ${
                index !== filteredSuggestions.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}>
              <div
                className='w-3 h-3 rounded-full shrink-0'
                style={{backgroundColor: getActivityColor(activity)}}
              />
              <span className='text-gray-700 font-medium'>{activity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
