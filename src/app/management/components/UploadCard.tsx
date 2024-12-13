'use client'
import { useEffect, useState, useRef, ChangeEvent } from "react";
import styles from "./Card.module.css";
import { ServerRequest } from "@/app/service/ServerRequest";
import ProgressTracker from "./ProgressTracker";
const UploadCard=()=>{

    const [files, setFiles]=useState<File[]>([]);
    const [startUpload, setStartUpload] = useState(false);
    const [uploadVisible, setUploadVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initiateUpload=async()=>{
        if (files.length > 0) {
            setStartUpload(true);
            setUploadVisible(false)
          }

    }

    const removeFile=(fileToRemove:File)=>{
        setFiles((previousFiles)=>{
          return  previousFiles.filter((file) => file.name !== fileToRemove.name)
        })
    }
    const addFile=async(event:ChangeEvent<HTMLInputElement>)=>{
        
        const newFiles=event.target.files;
        const noDuplicates:File[]=[]
        if(newFiles){
            for (var file of newFiles){
                var exists=false
                for(var sFile of files){
                    if(sFile.name==file.name){
                        exists=true
                        break
                    }
                }
                if(exists==false){
                    noDuplicates.push(file)
                }
            }
            if(noDuplicates.length>0){
                setStartUpload(false)
                setUploadVisible(true)
                setFiles((prevItems)=>{return[...prevItems,...noDuplicates]})
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            
        }
    }
 

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
                        onChange={addFile}
                        multiple
                    />
                    <button
                        className={`${styles.commonButton}`}
                        onClick={initiateUpload}
                        disabled={!uploadVisible} 
                    >
                        <img src="/svg/upload.svg" alt="Add" />
                        <p>Upload</p>
                    </button>
                </div>
            </div>
            <div className={styles.trackerContainer}>
            {files.map((item,index)=>{
                return <ProgressTracker key={index} file={item} startUpload={startUpload} removeFile={removeFile}></ProgressTracker>
            })}
            </div>
        </div>
    )

}

export default UploadCard 