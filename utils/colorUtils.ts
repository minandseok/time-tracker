// Activity color management utility

const ACTIVITY_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#ef4444', // red
  '#a855f7', // violet
  '#06b6d4', // sky
  '#22c55e', // green
];

const FIXED_COLORS: Record<string, string> = {
  잡동사니: '#9ca3af', // gray (fixed)
};

// Convert string to hash value
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Return consistent color based on activity name
export const getActivityColor = (activity: string): string => {
  // Return fixed color if available
  if (FIXED_COLORS[activity]) {
    return FIXED_COLORS[activity];
  }

  // Determine color index by hashing activity name
  const hash = hashString(activity);
  const colorIndex = hash % ACTIVITY_COLORS.length;
  return ACTIVITY_COLORS[colorIndex];
};
