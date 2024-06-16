'use client'

import React,{useEffect, useState,useRef} from "react"
import { notFound ,useSearchParams} from 'next/navigation'
import styles from './GetFile.module.css';
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const videoRef = useRef(null);
    const [fileURL, setFileURL] = useState<string>();

    useEffect(() => {

        const fileId = searchParams.get('fileId')
        if(typeof fileId ==="string"){
            setFileId(fileId)
        }
        const fetchFileURL = async () => {
            let API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_ADDRESS;
            if (API_BASE_URL !== undefined && typeof fileId === 'string') {
                const url =  API_BASE_URL ? `http://${API_BASE_URL}/getfile?fileId=${fileId}` : null;
                if (url) {
                    setFileURL(url);
                }
            } else {
                notFound();
            }
        };

        fetchFileURL();

    }, []);
    
    const handleTakeScreenshot = async () => {
        if (!videoRef.current || typeof fileId !== 'string') return;

        try {
            const canvas = await html2canvas(videoRef.current,{useCORS:true,allowTaint:true});
            const imageData = canvas.toDataURL('image/png');
            // Send the screenshot to the server
            await ServerRequest.sendScreenshot(fileId,imageData);
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    };

    return (
        
            <div className={styles.videoContainer}>
                {typeof fileURL !== "undefined" &&
                    <video ref={videoRef} controls className={styles.videoElement}>
                        <source src={fileURL} type="video/mp4" />
                    </video>
                }
            <button onClick={handleTakeScreenshot}>Take Screenshot</button>
        </div>
    );

}

export default GetFile;
