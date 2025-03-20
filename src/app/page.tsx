'use client'
import VideoCard from './files/components/VideoCard';
import { useEffect, useState } from 'react';
import { ServerRequest } from './service/ServerRequest';
import { usePathname  } from 'next/navigation';
import { FileDataList, FileData,Meta } from './types/FileDataList';
import Pagination from '@/app/files/components/Pagination';
import styles from '@/app/files/Files.module.css'
import Loading from './loading';
export default function Home() {

  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta,setMeta]=useState<Meta>({page: 1,limit: 1,total: 1})
  const pathname = usePathname()
  const totalPages = Math.ceil(meta.total / meta.limit);

  useEffect(() => {
    async function fetchFiles() {
        try {
            const filesDataList = await ServerRequest.fetchFiles(1);
            setFiles(filesDataList.data);
            setMeta(filesDataList.meta)
            sessionStorage.setItem('lastPage', pathname);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message)
          }else{
            setError('Failed to fetch files');
          }
          console.error('Error fetching files:', error);
        }
    }

    fetchFiles();
}, []);
  console.log(meta)
  return (
    <main className={styles.mainContainer}>
     
    <div className={styles.innerContainer}>
     {files.length === 0 && !error && (
       <Loading/>
     )}
     
     {error && (
       <p className="errorText">{error}</p>
     )}
     </div>

     {files.length > 0 && 
     <div className={styles.videosContainer}>
       {files.map((video) => (
         <VideoCard key={video.fileId} video={video}/>
       ))}
     </div>
     }
     {totalPages>1 && !error && (
       <Pagination meta={meta} performerId={null}></Pagination>
     )}
   </main>
 );
}
