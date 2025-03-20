
interface FileData {
    fileId: number;
    fileName: string;
}
  
interface Meta {
  page: number;
  limit: number;
  total: number;
}

interface FileDataList {
  data: FileData[];
  meta: Meta;
}
  
  
  export type { FileData, Meta, FileDataList };
  