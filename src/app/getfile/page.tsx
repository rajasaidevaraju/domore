'use client'

import React,{useEffect, useState,useRef} from "react"
import {useSearchParams,useRouter} from 'next/navigation'
import { Suspense } from 'react'
import styles from './GetFile.module.css';
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
import ToastMessage from '../types/ToastMessages'
import Loading from './../loading'
import { ToastData,MessageType } from "@/app/types/Types";
import RippleButton from "@/app/types/RippleButton";
const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";


const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const [fileName,setFileName]= useState<string>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const rateChnage="ratechange"
    const volumeChange="volumechange"
    const videoVolume="videoVolume"
    const videoMuted="videoMuted"
    const videoPlaybackSpeed="videoPlaybackSpeed"

    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = {id: Date.now(), message,type,};
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const handleRateChange = () => {
        if (videoRef.current) {
            const speed = videoRef.current.playbackRate;
            localStorage.setItem(videoPlaybackSpeed, speed.toString());
        }
    };

    const handleVolumeChange = () => {
        if (videoRef.current) {
            let volume = videoRef.current.volume;
            const isMuted = videoRef.current.muted;
            localStorage.setItem(videoMuted, isMuted.toString());
            if (!isMuted && volume > 0) {
                localStorage.setItem(videoVolume, volume.toString());
            }
        }
    };


    useEffect(() => {

        const currentFileId = searchParams.get('fileId')
        const controller = new AbortController();
        const {signal} = controller;
        if(typeof currentFileId ==="string"){
            if(videoRef.current){
                videoRef.current.src=`${API_BASE_URL}/server/file?fileId=${currentFileId}`
                videoRef.current.load();

                const playbackRate = parseFloat(localStorage.getItem(videoPlaybackSpeed) ?? '1');
                const storedVolume = parseFloat(localStorage.getItem(videoVolume) ?? '1');
                const storedMuted =  localStorage.getItem(videoMuted) === 'true';
        
                videoRef.current.playbackRate = (playbackRate >= 0.5 && playbackRate <= 2.0) ? playbackRate : 1;
                videoRef.current.volume = Math.min(Math.max(storedVolume, 0.1), 1);
                videoRef.current.muted = storedMuted;
                
                videoRef.current.addEventListener(rateChnage,handleRateChange)
                videoRef.current.addEventListener(volumeChange,handleVolumeChange)
            }
            let requestName=async ()=>{
                try{
                    let result=await ServerRequest.fetchName(currentFileId,signal)
                    setFileId(currentFileId)
                    setFileName(result)
                }catch(error){
                    if((error as Error).name === 'AbortError') {
    
                    }else{
                        if (error instanceof Error){
                            showToast(error.message,MessageType.DANGER)
                        }
                        console.error('Error:', error);
                    }
                }
            }
            requestName()
        }
       
        
        return () => {
            controller.abort();
            if(videoRef.current){
                videoRef.current.removeEventListener(rateChnage,handleRateChange)
                videoRef.current.removeEventListener(volumeChange,handleVolumeChange)
            }
        }

    }, [searchParams]);
    
    const handleTakeScreenshot = async () => {
        if (!videoRef.current || typeof fileId !== 'string'){
            showToast("Invalid File ID",MessageType.WARNING)
            return;
        }
        try {
            const canvas = await html2canvas(videoRef.current,{allowTaint: true});
            const imageData = canvas.toDataURL("image/jpeg", 0.3);
            // Send the screenshot to the server
            await ServerRequest.uploadThumbnail(fileId,imageData);
            showToast("Screenshot set as Thumbnail",MessageType.SUCCESS)
            
        } catch (error: Error | any) {
           
            if (error instanceof Error){
                showToast(error.message,MessageType.DANGER)
            }
            console.error('Error taking screenshot:', error);
        };
    };

    const deleteVideo = async()=>{
        if (typeof fileId !== 'string'){
            showToast("Invalid File ID ",MessageType.WARNING)
            return;
        }
        try {
            if (confirm("Do you want to delete the file!")) {
                await ServerRequest.deleteVideo(fileId)
                const lastPage = sessionStorage.getItem('lastPage');
                if (lastPage) {
                    router.push(lastPage);
                    sessionStorage.removeItem('lastPage');
                }else{
                    router.push("/")
                }
               
              } 
        } catch (error: Error | any) {
            if (error instanceof Error){
                showToast(error.message,MessageType.DANGER)
            }
            console.error('Error taking screenshot:', error);
        };
    }

    return (
        <div>
            <div className={styles.videoContainer}>
                
                <video crossOrigin="anonymous" ref={videoRef} controls className={styles.videoElement} >
                    <source src="null" type="video/mp4"/>
                </video>
                <h2>{fileName?fileName:"name.."}</h2>
                <div className={styles.buttonsDiv}>
                    <RippleButton className={styles.scbutton} onClick={handleTakeScreenshot}>Set As Thumbnail</RippleButton>
                    <RippleButton className={styles.scbutton} onClick={deleteVideo}>Delete Video</RippleButton>
                </div> 
            </div>
            {toasts.length > 0 && (<ToastMessage toasts={toasts} onClose={removeToast} />
      )}
            
        </div>
    );

}


export default function GetFilePage() {
    return (
      <Suspense fallback={<Loading/>}>
        <GetFile />
      </Suspense>
    );
  }

