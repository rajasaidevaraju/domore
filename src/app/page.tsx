'use client'
import VideoCard from './components/VideoCard';
import { useEffect, useState } from 'react';
import { ServerRequest } from './service/ServerRequest';


export default function Home() {

  const [files, setFiles] = useState<{ fileId: number; fileName: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchFiles() {
        try {
            const filesData = await ServerRequest.fetchFiles();
            setFiles(filesData);
        } catch (error) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', error);
        }
    }

    fetchFiles();
}, []);

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

    </main>
  );
}
