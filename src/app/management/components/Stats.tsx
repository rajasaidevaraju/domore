'use client'

import styles from "./management.module.css";
import { useState,useEffect } from 'react'
import {ServerRequest} from './../../service/ServerRequest'
import { ServerStats } from '@/app/types/Types'
import { formatSize } from '@/app/service/formatSize'
export default function Stats(){

    const [stats,setStats]=useState<ServerStats>()
    let files=typeof stats === "undefined"?0:stats.files
    let freeInternal= typeof stats === "undefined"?0:stats.freeInternal
    let freeExternal= typeof stats === "undefined"?0:stats.freeExternal
    let totalInternal= typeof stats === "undefined"?0:stats.totalInternal
    let totalExternal= typeof stats === "undefined"?0:stats.totalExternal
    let hasExternalStorage= typeof stats === "undefined"?false:stats.hasExternalStorage
    useEffect(()=>{
        const controller = new AbortController();
        const {signal} = controller;
        let requestStat=async ()=>{
            try{
                let result=await ServerRequest.fetchStats(signal)
                setStats(result)
            }catch(error){
                if((error as Error).name === 'AbortError') {

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
            <div className={styles.fileInfoContainer}>
                <p className={styles.text}> Internal Storage</p>
                <div className={styles.progressBar}>
                    <div className={styles.filledBar} style={{ width: `${((totalInternal-freeInternal)/totalInternal)*100}%` }}></div>
                </div>
                <div>
                    <p className={styles.storageText}>{`${formatSize(totalInternal-freeInternal)} / ${formatSize(totalInternal)}`}</p>
                </div>
            </div>
            {hasExternalStorage&&
            <>
             <p className={styles.text}> External Storage</p>
            <div className={styles.progressBar}>
                <div className={styles.filledBar} style={{ width: `${((totalExternal-freeExternal)/totalExternal)*100}%` }}></div>
            </div>
            <div>
                <p className={styles.storageText}>{`${formatSize(totalExternal-freeExternal)} / ${formatSize(totalExternal)}`}</p>
            </div>
             </>
            }
        </div>
    )
}
