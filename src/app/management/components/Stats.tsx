'use client'

import styles from "./management.module.css";
import { useState,useEffect } from 'react'
import {ServerRequest} from './../../service/ServerRequest'
import { ServerStats } from '@/app/types/Types'
import { formatSize } from '@/app/service/formatSize'
export default function Stats(){

    const [stats,setStats]=useState<ServerStats>()
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
                if((error as Error).name === 'AbortError') {
                    return;
                }else{
                    console.error('Error:', error);
                }
                
            }
           
        }
        requestStat()
        return () => {
            controller.abort();
        }
    },[])

    return(
        <div className={`${styles.cardContainer}`}>
             <div className={styles.header}>
             <h1>Stats</h1>
             </div>
            <p className={styles.text}> Files: {files}</p>
            <p className={styles.text}>Percentage: {batteryPercentage}%</p>
            <p className={styles.text}>Charging: {isCharging ? "Yes" : "No"}</p>
            <div>
                <p className={styles.text}> Internal Storage</p>
                <div className={styles.progressBar}>
                    <div className={styles.filledBar} style={{ width: `${((totalInternal-freeInternal)/totalInternal)*100}%` }}></div>
                </div>
                <div>
                    <p className={styles.storageText}>{`${formatSize(totalInternal-freeInternal)} / ${formatSize(totalInternal)}`}</p>
                </div>
            </div>
            {hasExternalStorage&&
            <div>
                <p className={styles.text}> External Storage</p>
                <div className={styles.progressBar}>
                    <div className={styles.filledBar} style={{ width: `${((totalExternal-freeExternal)/totalExternal)*100}%` }}></div>
                </div>
                <div>
                    <p className={styles.storageText}>{`${formatSize(totalExternal-freeExternal)} / ${formatSize(totalExternal)}`}</p>
                </div>
            </div>
            }
            
        </div>
    )
}
