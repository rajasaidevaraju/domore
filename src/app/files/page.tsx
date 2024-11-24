'use client'

import { useEffect, useState,Suspense } from 'react'
import VideoCard from './components/VideoCard';
import { ServerRequest } from '../service/ServerRequest';
import { FileDataList, FileData,Meta } from '../types/FileDataList';
import Pagination from './components/Pagination';
import { useSearchParams } from 'next/navigation'
import styles from './Files.module.css'; 
import Loading from './../loading'

function AltHome(){
    const searchParams = useSearchParams()
    const [files, setFiles] = useState<FileData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [meta,setMeta]=useState<Meta>({page: 1,limit: 1,total: 1})

    useEffect(() => {
       let pageNo = getPageNumber(searchParams.get("page"))
       async function fetchFiles() {
        try {
            const filesDataList = await ServerRequest.fetchFiles(pageNo);
            setFiles(filesDataList.data);
            setMeta(filesDataList.meta)
            
        } catch (error) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', error);
        }
    }

    fetchFiles();
    }, [searchParams]);
    

 return  (
    <main className={styles.mainContainer}>
     
     <div className={styles.innerContainer}>
      {files.length === 0 && !error && (
        <Loading/>
      )}
      {error && (
        <p className={styles.errorText}>{error}</p>
      )}
      </div>

      {files.length > 0 && 
      <div className={styles.videosContainer}>
        {files.map((video) => (
          <VideoCard key={video.fileId} video={video}/>
        ))}
      </div>
      }
    <Pagination {...meta}></Pagination>
    </main>
  );
}

function getPageNumber(page:string | null):number{
    if(page!=null){
        if(!isNaN(Number(page))){
            return Number(page);
        }
    }
    return 1;
}

export default function AltHomePage(){

    return (
        <Suspense fallback={<Loading/>}>
          <AltHome></AltHome>
        </Suspense>
      );
    
}