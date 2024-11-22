'use client'

import React,{useEffect, useState,useRef} from "react"
import {useSearchParams} from 'next/navigation'
import { Suspense } from 'react'
import styles from './GetFile.module.css';
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
import ToastMessage from './components/ToastMessages'
//var API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
//const NEXT_PUBLIC_IS_DEPLOYMENT_static= process.env.NEXT_PUBLIC_IS_DEPLOYMENT_static;


const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'warning' } | null>(null);

    const showToast = (message: string, type: 'success' | 'danger' | 'warning') => {
        setToast({ message, type });
    };


    useEffect(() => {

        const fileId = searchParams.get('fileId')
        if(typeof fileId ==="string"){
            setFileId(fileId)
            if(videoRef.current){
                videoRef.current.src=`/server/file?fileId=${fileId}`
                videoRef.current.load();
            }
        }

    }, [searchParams]);
    
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
                
            <video ref={videoRef} controls className={styles.videoElement}>
                <source src="" type="video/mp4" />
            </video>
                
            <button className="bg-dedede text-black font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out transform active:scale-95"
            style={{ backgroundColor: '#dedede' }} onClick={handleTakeScreenshot}>Set As Thumbnail</button>
            </div>
            {toast && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );

}


export default function GetFilePage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <GetFile />
      </Suspense>
    );
  }

