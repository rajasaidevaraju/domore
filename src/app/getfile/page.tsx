'use client'

import React,{useEffect, useState,useRef} from "react"
import { notFound ,useSearchParams} from 'next/navigation'
import styles from './GetFile.module.css';
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
import ToastMessage from './components/ToastMessages'

const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const videoRef = useRef(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'warning' } | null>(null);

    const showToast = (message: string, type: 'success' | 'danger' | 'warning') => {
        setToast({ message, type });
    };

    useEffect(() => {

        const fileId = searchParams.get('fileId')
        if(typeof fileId ==="string"){
            setFileId(fileId)
        }

    }, []);
    
    const handleTakeScreenshot = async () => {
        if (!videoRef.current || typeof fileId !== 'string') return;

        try {
            const canvas = await html2canvas(videoRef.current);
            const imageData = canvas.toDataURL("image/jpeg", 0.3);
            // Send the screenshot to the server
            await ServerRequest.sendScreenshot(fileId,imageData);
            showToast("Screenshot set as Thumbnail","success")
        } catch (error: Error | any) {
            if( error instanceof Error){
                showToast(error.message, 'danger')
            }
            console.error('Error taking screenshot:', error);
        };
        
    };

    return (
        <div>
            
            <div className={styles.videoContainer}>
                {typeof fileId !== "undefined" &&
                    <video ref={videoRef} controls className={styles.videoElement}>
                        <source src={`/server/file?fileId=${fileId}`} type="video/mp4" />
                    </video>
                }
            <button className="bg-dedede text-black font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform active:scale-95"
      style={{ backgroundColor: '#dedede' }} onClick={handleTakeScreenshot}>Take Screenshot</button>
        </div>
        {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );

}

export default GetFile;
