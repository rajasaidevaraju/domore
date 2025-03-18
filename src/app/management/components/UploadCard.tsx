'use client'
import { useEffect, useState, useRef, ChangeEvent } from "react";
import styles from "./management.module.css";
import ProgressTracker from "./ProgressTracker";
import RippleButton from "@/app/types/RippleButton";
const UploadCard=()=>{

    const [files, setFiles]=useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [uploadVisible, setUploadVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const token=useRef<string | null>(null)
    let suggestion=uploadVisible?undefined:"Choose files first"
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

    useEffect(() => {
        token.current = localStorage.getItem('token');  
    }, []);

    const removeFile=(fileToRemove:File)=>{
        let newArray=files.filter((file)=>file.name!==fileToRemove.name)
        if(newArray.length===0){
            setUploadVisible(false)
        }
        setFiles(newArray)
    }
    const addFile=async(event:ChangeEvent<HTMLInputElement>)=>{
        
        const newFiles=event.target.files;
        const noDuplicates:File[]=[]
        if(newFiles){
            for(let file of newFiles){
                const isDuplicate = files.some(existingFile => 
                    existingFile.name === file.name
                );
                
                if (!isDuplicate) {
                    noDuplicates.push(file);
                }
            }
            
            if(noDuplicates.length>0){
                setUploadVisible(true)
                for(const file of noDuplicates){
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    setFiles((prevItems)=>{return[...prevItems, file]});
                }
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
                    <RippleButton
                        className={`${styles.commonButton}`}
                        onClick={initiateUpload}
                        disabled={!uploadVisible}
                        suggestion={suggestion} 
                    >
                        <img src="/svg/upload.svg" alt="Add" />
                        <p>Upload</p>
                    </RippleButton>
                </div>
            </div>
            <div className={styles.trackerContainer}>
                {files.map((item, index) => (
                    <ProgressTracker 
                        key={item.name} 
                        file={item}
                        token={token.current} 
                        startUpload={uploadingFiles.has(item.name)} 
                        removeFile={removeFile}
                    />
                ))}
            </div>
        </div>
    )

}

export default UploadCard 