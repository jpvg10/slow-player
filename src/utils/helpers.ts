export const secondsToTimestamp = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${paddedMinutes}:${paddedSeconds}`;
};

export const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const totalSeconds = minutes * 60 + seconds;
  return totalSeconds;
};
