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