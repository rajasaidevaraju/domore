// app/AltHomePage.tsx
import { ServerRequest } from '../service/ServerRequest';
import { Suspense } from "react";
import { HomeSearchParams } from '../types/Types';
import NavContextBridge  from "@/app/files/components/NavContextBridge";
import styles from './Files.module.css';
import { notFound } from 'next/navigation';
import VideoList from './components/VideoList';
import SortDropdown from './components/SortDropdown';
import Loading from '../loading';


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

    if (performerIdStr) {
      const parsed = Number(performerIdStr);
      if (!isNaN(parsed)) {
        performerId = parsed;
      } else {
        return notFound();
      }
    }

    
    return (
      <main className={styles.mainContainer}>
        <div className={styles.controlDiv}>
          <SortDropdown selected={sortByStr ?? "latest"} />
        </div>
        
        <NavContextBridge page={pageNo} performerId={performerId} sortBy={sortByStr}/>
         <Suspense fallback={<Loading  />}>
          <VideoList page={pageNo} performerId={performerId} sortBy={sortByStr} />
        </Suspense>
     </main>
    );

}

function getPageNumber(page: string | undefined): number {
  if (page && !isNaN(Number(page))) {
    return Number(page);
  }
  return 1;
}
