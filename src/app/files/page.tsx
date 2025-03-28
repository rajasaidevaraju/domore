'use client'

import { useEffect, useState,Suspense } from 'react'
import VideoCard from './components/VideoCard';
import { usePathname } from 'next/navigation'
import { ServerRequest } from '../service/ServerRequest';
import { FileDataList, FileData,Meta } from '../types/FileDataList';
import Pagination from './components/Pagination';
import { useSearchParams } from 'next/navigation'
import styles from './Files.module.css'; 
import Loading from './../loading'
import path from 'path';

function AltHome(){
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [files, setFiles] = useState<FileData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [meta,setMeta]=useState<Meta>({page: 1,limit: 1,total: 1})
    const [performerId, setPerformerId] = useState<number | null>(null);

    const totalPages = Math.ceil(meta.total / meta.limit);
    useEffect(() => {
       let pageNo = getPageNumber(searchParams.get("page"))
       let performerIdStr = searchParams.get("performerId")
       
       async function fetchFiles() {
        try {
            var filesDataList:FileDataList 
            let newPerformerId = null;

            if(performerIdStr==null){
              filesDataList= await ServerRequest.fetchFiles(pageNo);
            }else{
              if(!isNaN(Number(performerIdStr))){
                newPerformerId=Number(performerIdStr)
                filesDataList= await ServerRequest.fetchFiles(pageNo,newPerformerId);

              }else{
                setError('Invalid performerId')
                return;
              }
            }
            
            setFiles(filesDataList.data);
            setMeta(filesDataList.meta)
            setPerformerId(newPerformerId);
            sessionStorage.setItem('lastPage', pathname);
            window.scrollTo(0, 0);            
        } catch (error) {
            if (error instanceof Error) {
              setError(error.message)
            }else{
              setError('Failed to fetch files');
            }
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
         <Pagination meta={meta} performerId={performerId}/>
      )}
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