'use client'
import {useState, useRef, ChangeEvent } from "react";
import { StorageLocation } from "@/app/types/Types";
import styles from "./management.module.css";
import ProgressTracker from "./ProgressTracker";
import RippleButton from "@/app/types/RippleButton";
import { useStatsStore } from "@/app/store/statsStore";
import { formatSize } from "@/app/service/formatSize";

const UploadCard=()=>{

    const [files, setFiles]=useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [uploadVisible, setUploadVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedStorage, setSelectedStorage] = useState<StorageLocation>(StorageLocation.Internal);
    const {stats} = useStatsStore();

    let suggestion=uploadVisible?undefined:"Choose files first"

    const totalFreeSpace = stats? selectedStorage === StorageLocation.Internal? stats.freeInternal: (stats.hasExternalStorage ? stats.freeExternal : 0): 0;

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

    const handleStorageChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedStorage(event.target.value as StorageLocation);
    };

    const removeFile=(fileToRemove:File)=>{
        let newArray=files.filter((file)=>file.name!==fileToRemove.name)
        if(newArray.length===0){
            setUploadVisible(false)
        }
        setFiles(newArray)

        setUploadingFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(fileToRemove.name);
            return newSet;
        });
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
                setFiles((prevItems) => [...prevItems, ...noDuplicates]);
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
                    {stats && (
                        <div>
                            {formatSize(totalFreeSpace)} Free
                        </div>
                    )}
                    <select
                        className={styles.commonButton}
                        value={selectedStorage}
                        onChange={handleStorageChange}
                        style={{height: 'auto'}} 
                        aria-label="Select storage location"
                    >
                        <option value={StorageLocation.Internal}>Internal</option>
                        {stats && stats.hasExternalStorage && (
                            <option value={StorageLocation.External}>External</option>
                        )}
                    </select>
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
                {files.map((item) => (
                    <ProgressTracker 
                        key={item.name} 
                        file={item}
                        startUpload={uploadingFiles.has(item.name)} 
                        removeFile={removeFile}
                        selectedStorage={selectedStorage}
                    />
                ))}
            </div>
        </div>
    )

}

export default UploadCard 