'use client'

import React,{useEffect, useState,useRef} from "react"
import { notFound ,useSearchParams} from 'next/navigation'
import styles from './GetFile.module.css';
import Banner from "../components/Banner";
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const videoRef = useRef(null);

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
            const imageData = canvas.toDataURL('image/png');
            // Send the screenshot to the server
            await ServerRequest.sendScreenshot(fileId,imageData);
        } catch (error) {
            console.error('Error taking screenshot:', error);
        }
    };

    return (
        <div>
            
            <div className={styles.videoContainer}>
                {typeof fileId !== "undefined" &&
                    <video ref={videoRef} controls className={styles.videoElement}>
                        <source src={`/server/file?fileId=${fileId}`} type="video/mp4" />
                    </video>
                }
            <button onClick={handleTakeScreenshot}>Take Screenshot</button>
        </div>
        </div>
    );

}

export default GetFile;
