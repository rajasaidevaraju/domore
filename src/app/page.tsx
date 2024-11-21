'use client'
import VideoCard from './components/VideoCard';
import { useEffect, useState } from 'react';
import { ServerRequest } from './service/ServerRequest';
import { FileDataList, FileData,Meta } from './types/FileDataList';
import Pagination from './components/Pagination';

type HomeProps = {
  page?: number;
};

export default function Home({ page }: HomeProps) {

  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta,setMeta]=useState<Meta>({page: 1,limit: 1,total: 1})
  
  useEffect(() => {
    async function fetchFiles() {
        try {
            const filesDataList = await ServerRequest.fetchFiles(page);
            setFiles(filesDataList.data);
            setMeta(filesDataList.meta)
            
        } catch (error) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', error);
        }
    }

    fetchFiles();
}, [page]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-18">
     
     <div className="flex flex-col justify-center items-center h-full">
      {files.length === 0 && !error && (
        <p className="text-gray-600">Loading...</p>
      )}
      {error && (
        <p className="text-red-600">{error}</p>
      )}
      </div>

      {files.length > 0 && 
      <div className="videos-container">
        {files.map((video) => (
          <VideoCard key={video.fileId} video={video}/>
        ))}
      </div>
      }
    <Pagination {...meta}></Pagination>
    </main>
  );
}
