'use client'

import React,{useEffect, useState,useRef} from "react"
import {useSearchParams,useRouter} from 'next/navigation'
import { Suspense } from 'react'
import styles from './GetFile.module.css';
import html2canvas from "html2canvas";
import {ServerRequest} from './../service/ServerRequest'
import ToastMessage from '../types/ToastMessages'
import Loading from './../loading'
import { ToastData,MessageType, EntityType,Item } from "@/app/types/Types";
import RippleButton from "@/app/types/RippleButton";
import AddPerformerPanel from "./components/AddPanel";
import { FilterRequests } from "../service/FilterRequests";
import RippleButtonLink from "../types/RippleButtonLink";
const IS_DEPLOYMENT_STATIC = process.env.NEXT_PUBLIC_IS_DEPLOYMENT_STATIC === "true";
const API_BASE_URL = IS_DEPLOYMENT_STATIC ? "" : process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "";


const GetFile = () => {
    const searchParams = useSearchParams()
    const [fileId, setFileId] = useState<string>();
    const [fileName,setFileName]= useState<string>();
    const [performers,setPerformers]=useState<Item[]>()
    const [addPanel,setAddPanel]=useState<boolean>(false)

    const videoRef = useRef<HTMLVideoElement>(null);
    const token=useRef<string | null>(null)
    const router = useRouter();

    const rateChnage="ratechange"
    const volumeChange="volumechange"
    const videoVolume="videoVolume"
    const videoMuted="videoMuted"
    const videoPlaybackSpeed="videoPlaybackSpeed"
    
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = {id: Date.now(), message,type};
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

    async function savePerformer(performerId:number){
        try {
            
            setAddPanel(false)
            let token=localStorage.getItem('token')

            if(token==null){
                throw new Error("Unauthorized access. Please Login")
            }

            if(typeof fileId !== 'string' || isNaN(Number(fileId))){
                throw new Error("Invalid File ID")
            }else{
                showToast("Request sent to Server",MessageType.SUCCESS)
                let response=await FilterRequests.addItemToFile(Number(fileId),performerId, EntityType.Performer, token)
                if(response.message){
                    requestFileDetails(fileId)
                    showToast(response.message,MessageType.SUCCESS)
                }


            }
            

        } catch (error) {
            let message=`Failed to add performer to file ${fileId}`
            if(error instanceof Error){
                message=error.message
            }
            showToast(message,MessageType.DANGER)

        }
    }
    
    async function requestFileDetails(currentFileId:string,signal?:AbortSignal){
        try{
            let result=await ServerRequest.fetchfileDetails(currentFileId,signal)
            console.log(result)
            setFileId(currentFileId)
            setFileName(result.name)
            setPerformers(result.performers)
        }catch(error){
            if((error as Error).name === 'AbortError') {

            }else{
                if (error instanceof Error){
                    showToast(error.message,MessageType.DANGER)
                    setFileName(error.message)
                }
                console.error('Error:', error);
            }
        }
    }


    useEffect(() => {
        token.current=localStorage.getItem('token')
        const currentFileId = searchParams.get('fileId')
        const controller = new AbortController();
        const {signal} = controller;
        if(typeof currentFileId ==="string"){
            const videoElement = videoRef.current;
            if(videoElement){
                videoElement.src=`${API_BASE_URL}/server/file?fileId=${currentFileId}`
                videoElement.load();

                const playbackRate = parseFloat(localStorage.getItem(videoPlaybackSpeed) ?? '1');
                const storedVolume = parseFloat(localStorage.getItem(videoVolume) ?? '1');
                const storedMuted =  localStorage.getItem(videoMuted) === 'true';
        
                videoElement.playbackRate = (playbackRate >= 0.5 && playbackRate <= 2.0) ? playbackRate : 1;
                videoElement.volume = Math.min(Math.max(storedVolume, 0.1), 1);
                videoElement.muted = storedMuted;
                
                videoElement.addEventListener(rateChnage,handleRateChange)
                videoElement.addEventListener(volumeChange,handleVolumeChange)
            }
            requestFileDetails(currentFileId,signal)
        }
       
        
        return () => {
            controller.abort();
            const videoElement = videoRef.current;
            if(videoElement){
                videoElement.removeEventListener(rateChnage,handleRateChange)
                videoElement.removeEventListener(volumeChange,handleVolumeChange)
            }
        }

    }, [searchParams]);
    
    const handleTakeScreenshot = async () => {
        let currToken=token.current
        if(currToken!=null){
            const videoElement = videoRef.current;
            if (!videoElement || typeof fileId !== 'string'){
                showToast("Invalid File ID",MessageType.WARNING)
                return;
            }
            try {
                const canvas = await html2canvas(videoElement,{allowTaint: true});
                const imageData = canvas.toDataURL("image/jpeg", 0.3);
                // Send the screenshot to the server
                await ServerRequest.uploadThumbnail(fileId,imageData,currToken);
                showToast("Screenshot set as Thumbnail",MessageType.SUCCESS)
                
            } catch (error: Error | any) {
               
                if (error instanceof Error){
                    showToast(error.message,MessageType.DANGER)
                }
                console.error('Error taking screenshot:', error);
            };
        }
        
    };

    const deleteVideo = async()=>{
        let currToken=token.current
        if (typeof fileId !== 'string'){
            showToast("Invalid File ID ",MessageType.WARNING)
            return;
        }
        if(currToken!=null){
            try {
                if (confirm("Do you want to delete the file!")) {
                    await ServerRequest.deleteVideo(fileId,currToken)
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
                console.error('Error while deleting video:', error);
            };
        }
        
    }

    return (
        
        <div className={styles.videoContainer}>
            
            <video crossOrigin="anonymous" ref={videoRef} controls className={styles.videoElement} >
                <source src="null" type="video/mp4"/>
            </video>
            <p className={styles.name}>{fileName?fileName:"name.."}</p>
            <div className={styles.buttonsDiv}>
                <p>Performers: </p>
                {performers === undefined||performers.length<1 ? (<p>No Performers</p>) : (
                    performers.map((performer) => (
                        <RippleButtonLink 
                            href={`/files?performerId=${performer.id}`} 
                            className={styles.scbutton} 
                            key={performer.id}
                        >
                            <p>{performer.name}</p>
                        </RippleButtonLink>
                    ))
                )}
                {token.current != null && (
                <>
                    {addPanel ? (
                        <AddPerformerPanel onClose={() => setAddPanel(false)} onSave={savePerformer} showToast={showToast} />
                    ) : (
                        <RippleButton className={`${styles.scbutton}`} onClick={() => setAddPanel(true)}>
                            <img src="/svg/add.svg" alt="Add" />
                        </RippleButton>
                    )}
                </>
                )}
            </div>
            {token.current !=null && 
                <div className={styles.buttonsDiv}>
                        <p>Actions: </p>
                    <RippleButton className={styles.scbutton} onClick={handleTakeScreenshot}>Set As Thumbnail</RippleButton>
                    <RippleButton className={styles.scbutton} onClick={deleteVideo}>Delete Video</RippleButton>
                    <RippleButton className={styles.scbutton}>Edit Name</RippleButton>
                </div> 
            }
            {toasts.length > 0 && (<ToastMessage toasts={toasts} onClose={removeToast} />)}
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

