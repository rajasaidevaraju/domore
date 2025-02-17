'use client'
import { useEffect, useState, useRef, ChangeEvent } from "react";
import styles from "./management.module.css";
import { ServerRequest } from "@/app/service/ServerRequest";
import ProgressTracker from "./ProgressTracker";
const UploadCard=()=>{

    const [files, setFiles]=useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [uploadVisible, setUploadVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initiateUpload=async()=>{
        if (files.length > 0) {
            setUploadVisible(false)
            files.forEach((file, index) => {
                setTimeout(() => {
                    setUploadingFiles(prev => new Set(prev).add(file.name));
                }, index * 300); 
            });
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
            Array.from(newFiles).forEach(file => {
                const isDuplicate = files.some(existingFile => 
                    existingFile.name === file.name
                );
                
                if (!isDuplicate) {
                    noDuplicates.push(file);
                }
            });
            if(noDuplicates.length>0){
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
                {files.map((item, index) => (
                    <ProgressTracker 
                        key={item.name} 
                        file={item} 
                        startUpload={uploadingFiles.has(item.name)} 
                        removeFile={removeFile}
                    />
                ))}
            </div>
        </div>
    )

}

export default UploadCard 