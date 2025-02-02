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

    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = {id: Date.now(), message,type,};
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    useEffect(() => {

        const currentFileId = searchParams.get('fileId')
        const controller = new AbortController();
        const {signal} = controller;
        if(typeof currentFileId ==="string"){
            if(videoRef.current){
                videoRef.current.src=`${API_BASE_URL}/server/file?fileId=${currentFileId}`
                videoRef.current.load();
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
                
                <video crossOrigin="anonymous" ref={videoRef} controls className={styles.videoElement}>
                    <source src="null" type="video/mp4" />
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

