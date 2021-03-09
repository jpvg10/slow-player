export const secondsToTimestamp = (totalSeconds: number): string => {
  if (totalSeconds < 0) {
    throw new Error('Number must be >= 0');
  }
  const hours = Math.floor(totalSeconds / 3600);
  const remaining = Math.floor(totalSeconds % 3600);
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  const paddedHours = hours === 0 ? '' : hours < 10 ? `0${hours}:` : `${hours}:`;
  const paddedMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${paddedHours}${paddedMinutes}${paddedSeconds}`;
};

export const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':');
  if (parts.length > 3) {
    throw new Error('Timestamp must be in the formats SS, MM:SS or HH:MM:SS');
  }

  let totalSeconds = 0;
  let factor = 1;
  for (let i = parts.length - 1; i >= 0; i--) {
    const current = Number(parts[i]);
    if (Number.isNaN(current)) {
      throw new Error('Timestamp must consist only of numbers separated by a colon');
    }
    if (current < 0) {
      throw new Error('Timestamp must consist only of numbers >= 0');
    }
    totalSeconds += current * factor;
    factor *= 60;
  }

  return totalSeconds;
};
