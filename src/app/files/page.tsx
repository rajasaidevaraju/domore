// app/AltHomePage.tsx
import { ServerRequest } from '../service/ServerRequest';
import { FileDataList} from '../types/FileDataList';
import { HomeSearchParams } from '../types/Types';
import NavContextBridge  from "@/app/files/components/NavContextBridge";
import styles from './Files.module.css';
import { notFound } from 'next/navigation';
import VideoCard from './components/VideoCard'
import Pagination from './components/Pagination';


export default async function AltHomePage({searchParams}: {searchParams:HomeSearchParams}) {
  const params= await searchParams;
  const pagenoStr= params.page;
  const performerIdStr = params.performerId;
  let pageNo=1
  if(pagenoStr!=null &&!isNaN(Number(pagenoStr))){
    pageNo=getPageNumber(pagenoStr);
  }
  let performerId: number | null = null;
  let filesDataList: FileDataList;

  try {
    if (performerIdStr !== undefined) {
      const parsed = Number(performerIdStr);
      if (!isNaN(parsed)) {
        performerId = parsed;
        filesDataList = await ServerRequest.fetchFiles(pageNo, performerId);
      } else {
        return notFound();
      }
    } else {
      filesDataList = await ServerRequest.fetchFiles(pageNo);
    }
    let fileData=filesDataList.data;
    let meta=filesDataList.meta;
    
    return (
      <main className={styles.mainContainer}>
        <NavContextBridge page={pageNo} performerId={performerId} />
        <div className={styles.videosContainer}>
          {fileData.map((video) => (
            <VideoCard key={video.fileId} video={video}/>
          ))}
        </div>
       
        {meta.total>1 &&(
            <Pagination meta={meta} performerId={performerId}/>
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
