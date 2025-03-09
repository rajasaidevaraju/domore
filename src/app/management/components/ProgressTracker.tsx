import { useEffect, useState, useRef } from "react";
import { ServerRequest } from "@/app/service/ServerRequest";
import { formatSize } from "@/app/service/formatSize";
import styles from "./management.module.css";


interface ProgressTrackerProps {
    file: File;
    startUpload:boolean
    removeFile:(file:File)=>void
    token:string|null
  }

const ProgressTracker: React.FC<ProgressTrackerProps>  = ({file,startUpload,removeFile,token}) => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0); 
  const xhr = useRef<XMLHttpRequest | null>(null);
  const uploadStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [aborted,setAborted] = useState(false)


  const handleFileUpload = async () => {
    if(token==null){
      setError('Unauthorized')
      return  
    }else{
      setError(null)
    }
    if (file) {
        setProgress(0);
        setSpeed(0);
        try{
            await ServerRequest.uploadFile(file,token,(progress,speed)=>{
                setProgress(progress);
                setSpeed(speed);
             },(xhrObj:XMLHttpRequest)=>{
                xhr.current=xhrObj
             })
            console.log(`File "${file.name}" uploaded successfully`);
            
        }
        catch(error){
          setError(error instanceof Error ? error.message : 'Upload failed');
          console.error(error);
        }
       
    }
};

const stopUpload=()=>{
  if(xhr.current!=null){
    xhr.current.abort()
  }
  setAborted(true)
    setTimeout(() => {
      removeFile(file)
    }, 1000);

}

useEffect(()=>{
  
  if( startUpload&& !uploadStarted.current){
    handleFileUpload()
    uploadStarted.current=true
  }

  return ()=>{
    if(xhr.current!=null){
      xhr.current.abort()
    }
  }
},[startUpload])


  return (
    <div className={styles.tracker}>
      <div className={styles.infoRow}>
        <p className={`${styles.text} ${styles.left}`}>{file.name}</p>
        <button className={`${styles.removeButton} ${styles.commonButton} ${styles.right} ${aborted || progress === 100 ? styles.hidden : ''}`} onClick={stopUpload}>
          <img src="/svg/delete.svg" alt="Stop Upload" />
        </button>
        
      </div>  
      
      <div className={styles.progressBar}>
        <div className={styles.filledBar} style={{ width: `${progress.toFixed(2)}%` }}></div>
      </div>
      <div className={styles.infoRow}>
        <p className={`${styles.text} ${styles.left}`}>{formatSize(file.size)}</p>
        {!aborted && !error && progress>0 &&(<>
          {progress < 100 && (<p className={`${styles.text} ${styles.right}`}>{formatSize(speed)}/s</p>)}
          {progress == 100 && (<p className={`${styles.text} ${styles.right}`}>Upload Success</p>)}
         </>
        )}
        {aborted && !error && <p className={`${styles.text} ${styles.right}`}>Upload Aborted</p>}
        {!aborted && error && (
          <p className={`${styles.text} ${styles.right} ${styles.error}`}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;