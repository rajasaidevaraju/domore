const oneKiloByte=1024
const oneMegaByte=1048576
const oneGigaByte=1073741824

export const formatSize = (size: number): string => {
  if (size < oneKiloByte) {
      return `${size.toFixed(0)} B`;
  } else if (size < oneMegaByte) {
      return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < oneGigaByte) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }else{
    return `${(size / (1024 * 1024*1024)).toFixed(2)} GB`;
  }
};

export const formatDuration = (ms: number): string => {
  if (!ms || ms < 0) return "0:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};