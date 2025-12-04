'use client'

import styles from "./management.module.css";
import { useEffect } from 'react'
import { formatSize } from '@/app/service/formatSize'
import { useStatsStore } from '@/app/store/statsStore';
import Loading from '@/app/loading'

export default function Stats(){

    const { stats, isLoading, error, fetchStats } = useStatsStore();
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        
        fetchStats(signal);
        
        return () => {
          controller.abort();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if (isLoading && !stats) {
        return (
          <div className={`${styles.cardContainer}`}>
            <div className={styles.header}>
              <h1>Stats</h1>
            </div>
            <Loading text="Requesting Stats" />
          </div>
        );
    }



    if (error) {
        return (
          <div className={`${styles.cardContainer}`}>
            <div className={styles.header}>
              <h1>Stats</h1>
            </div>
            <div>
              <p className="errorText">Error: {error}</p>
            </div>
          </div>
        );
    }
    if(!stats || stats==null){
        return (
        <div className={`${styles.cardContainer}`}>
            <div className={styles.header}>
                <h1>Stats</h1>
            </div>
            <Loading text="Requesting Stats"/>
        </div>
        )
    }

    const {
        files = 0,
        freeInternal = 0,
        freeExternal = 0,
        totalInternal = 0,
        totalExternal = 0,
        hasExternalStorage = false,
        percentage: batteryPercentage = -1,
        charging: isCharging = false,
      } = stats;

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
