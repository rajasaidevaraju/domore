// app/AltHomePage.tsx
import { ServerRequest } from '../service/ServerRequest';
import { Suspense } from "react";
import { HomeSearchParams } from '../types/Types';
import NavContextBridge  from "@/app/files/components/NavContextBridge";
import styles from './Files.module.css';
import { notFound } from 'next/navigation';
import VideoCard from './components/VideoCard'
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';


export default async function AltHomePage({searchParams}: {searchParams:HomeSearchParams}) {
  const params= await searchParams;
  const pagenoStr= params.page;
  const performerIdStr = params.performerId;
  const sortByStr = params.sortBy;
  let pageNo=1
  if(pagenoStr!=null &&!isNaN(Number(pagenoStr))){
    pageNo=getPageNumber(pagenoStr);
  }
  let performerId: number | null = null;

  try {
    if (performerIdStr) {
      const parsed = Number(performerIdStr);
      if (!isNaN(parsed)) {
        performerId = parsed;
      } else {
        return notFound();
      }
    }
    const filesDataList = await ServerRequest.fetchFiles(pageNo, performerId ?? undefined, sortByStr);
    let fileData=filesDataList.data;
    let meta=filesDataList.meta;
    
    return (
      <main className={styles.mainContainer}>
        <div className={styles.controlDiv}>
          <SortDropdown selected={sortByStr ?? "latest"} />
        </div>
        
        <NavContextBridge page={pageNo} performerId={performerId} sortBy={sortByStr}/>
        <div className={styles.videosContainer}>
          {fileData.map((file) => (
            <VideoCard key={file.fileId} file={file}/>
          ))}
        </div>
       
        {meta.total>1 &&(
            <Pagination meta={meta} performerId={performerId} sortBy={sortByStr}/>
        )}
     </main>
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Error fetching files';
    return (
    <main className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <p className="errorText">{errorMessage}</p>
      </div>
    </main>
  );
  }
}

function getPageNumber(page: string | undefined): number {
  if (page && !isNaN(Number(page))) {
    return Number(page);
  }
  return 1;
}
