const oneKiloByte = 1024
const oneMegaByte = 1048576
const oneGigaByte = 1073741824

export const formatSize = (size: number): string => {
  if (size < oneKiloByte) {
    return `${size.toFixed(0)} B`;
  } else if (size < oneMegaByte) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < oneGigaByte) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

export const formatDuration = (ms: number): string => {
  if (!ms || ms < 0) return "0:00";

  const totalSeconds = Math.floor(ms / 1000);
  return formatTime(totalSeconds);
};

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}