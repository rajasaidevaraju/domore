'use client'
import { useEffect, useState, useRef } from "react";
import styles from "./Card.module.css";
import { ServerRequest } from "@/app/service/ServerRequest";
import ProgressTracker from "./ProgressTracker";
const UploadCard=()=>{

    const [progress, setProgress] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(0);
    const [file, setFile]=useState<File>();

    const fileInputRef = useRef<HTMLInputElement>(null);
    let name=file?.name;
    let size=0;
    if(file){
        size=file.size/(1024*1024*1024)
    }
    const handleFileUpload = async () => {
        if (file) {
            console.log(file)
            setProgress(0);
            setSpeed(0);
            try{
                await ServerRequest.uploadFile(file,(progress,speed)=>{
                    setProgress(progress);
                    setSpeed(speed);
                 })
                console.log(`File "${name}" uploaded successfully`);
                
            }
            catch(error){
                console.error(error);

            }finally{
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setFile(undefined);
            }
           
        }
    };

    useEffect(()=>{
        console.log("Inside use effect of upload card")
      },[])

    return(    
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <h1>{"Upload File"}</h1>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.commonButton}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p>Choose</p>
                    </button>
                    <input
                        id="fileInput"
                        type="file"
                        ref={fileInputRef}
                        accept="video/*, .mkv"
                        style={{ display: 'none' }}
                        onChange={(event)=>{setFile(event.target.files?.[0])}}
                    />
                    <button
                        className={`${styles.commonButton}`}
                        onClick={handleFileUpload}
                        disabled={file?false:true} 
                    >
                        <img src="/svg/upload.svg" alt="Add" />
                        <p>Upload</p>
                    </button>
                </div>
            </div>
           
            <div>
                <p className={styles.text}>Selected File Name: {name}</p>
                <p className={styles.text}>Selected File Size: {size.toFixed(2)} GB</p>
                <p className={styles.text}>Progress: {progress.toFixed(2)}%</p>
                <p className={styles.text}>Speed: {(speed / 1024).toFixed(2)} MB/s</p>
            </div>

        </div>
    )

}

export default UploadCard 