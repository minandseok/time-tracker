export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  const today = new Date();
  const recordDate = new Date(date);

  if (recordDate.toDateString() === today.toDateString()) {
    return '오늘';
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (recordDate.toDateString() === yesterday.toDateString()) {
    return '어제';
  }

  return recordDate.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });
}
