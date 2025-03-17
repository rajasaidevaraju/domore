'use client'

import styles from "./management.module.css";
import { useState,useEffect } from 'react'
import {ServerRequest} from './../../service/ServerRequest'
import { ServerStats } from '@/app/types/Types'
import { formatSize } from '@/app/service/formatSize'
import { Suspense } from "react";
import Loading from '@/app/loading'

export default function Stats(){

    const [stats,setStats]=useState<ServerStats>()
    const [error,setError]=useState<string | null>(null)
    let files = stats?.files ?? 0;
    let freeInternal = stats?.freeInternal ?? 0;
    let freeExternal = stats?.freeExternal ?? 0;
    let totalInternal = stats?.totalInternal ?? 0;
    let totalExternal = stats?.totalExternal ?? 0;
    let hasExternalStorage = stats?.hasExternalStorage ?? false;
    let batteryPercentage = stats?.percentage ?? -1;
    let isCharging = stats?.charging ?? false;

    useEffect(()=>{
        const controller = new AbortController();
        const {signal} = controller;
        let requestStat=async ()=>{
            try{
                let result=await ServerRequest.fetchStats(signal)
                setStats(result)
            }catch(error){
                if(error instanceof Error){
                    if(error.name === 'AbortError') {
                        return;
                    }else{
                        setError((error.message))
                        console.error('Error:', error);
                    }
                }
                
            }
           
        }
        requestStat()
        return () => {
            controller.abort();
        }
    },[])


    if(error){
        return (
            <div className={`${styles.cardContainer}`}>
                <div className={styles.header}>
                    <h1>Stats</h1>
                </div>
                <div>
                    <p className="errorText">Error: {error}</p>
                </div>
            </div>
        )
    }
    if(!stats || stats==null){
        return (
        <div className={`${styles.cardContainer}`}>
            <div className={styles.header}>
                <h1>Stats</h1>
            </div>
            <Loading/>
        </div>
        )
    }

    return(
        <div className={`${styles.cardContainer}`}>
            <div className={styles.header}>
                <h1>Stats</h1>
            </div>
            <div>
                <p className={styles.text}>Files: {files}</p>
                <p className={styles.text}>Percentage: {batteryPercentage}%</p>
                <p className={styles.text}>Charging: {isCharging ? "Yes" : "No"}</p>
            </div>
            
            <div>
                <StorageBar total={totalInternal} free={freeInternal} storageName="Internal Storage"/>
            </div>
            {hasExternalStorage&&
            <div>
                <StorageBar total={totalExternal} free={freeExternal} storageName="External Storage"/>
            </div>
            }
            
        </div>
    )
}

function StorageBar(props:{total:number,free:number,storageName:string}){
    return(
        <div>
            <p className={styles.text}>{props.storageName}</p>
            <div className={styles.progressBar}>
                <div className={styles.filledBar} style={{ width: `${((props.total-props.free)/props.total)*100}%` }}/>
            </div>
            <div>
                <p className={styles.storageText}>{`${formatSize(props.total-props.free)} / ${formatSize(props.total)}`}</p>
            </div>
        
        </div>
        
    )
}
