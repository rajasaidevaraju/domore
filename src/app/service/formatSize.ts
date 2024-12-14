const oneKiloByte=1024
const oneMegaByte=1024*1024
const oneGigaByte=1024*1024*1024

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