import { useEffect, useState, useRef } from "react";
import { ServerRequest } from "@/app/service/ServerRequest";
import styles from "./Card.module.css";


interface ProgressTrackerProps {
    file: File;
    startUpload:boolean
  }

const ProgressTracker: React.FC<ProgressTrackerProps>  = ({file,startUpload}) => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const uploadStarted = useRef(false);

  const handleFileUpload = async () => {
    if (file) {
        console.log(file)
        setProgress(0);
        setSpeed(0);
        try{
            await ServerRequest.testUploadFile(file,(progress,speed)=>{
                setProgress(progress);
                setSpeed(speed);
             })
            console.log(`File "${file.name}" uploaded successfully`);
            
        }
        catch(error){
            console.error(error);
        }
       
    }
};

if(startUpload && !uploadStarted.current){
  console.log(`${file.name} upload called`)
  handleFileUpload()
  uploadStarted.current=true


}


  return (
    <div className={styles.tracker}>
      <p className={styles.text}>{file.name}</p>
      <div className={styles.progressBar}>
        <div className={styles.filledBar} style={{ width: `${progress.toFixed(2)}%` }}></div>
      </div>
      <div>
        <p className={styles.text}>Size: {(file.size/(1024*1024)).toFixed(0)} MB</p>
        <p className={styles.text}>Progress: {progress.toFixed(2)}%</p>
        <p className={styles.text}>Speed: {(speed / 1024).toFixed(2)} MB/s</p>
      </div>
     
    </div>
  );
};

export default ProgressTracker;