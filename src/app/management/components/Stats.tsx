import styles from './Card.module.css'

export default function Stats(){
    return(
        <div className={`${styles.cardContainer} ${styles.statsContainer}`}>
             <div className={styles.header}>
             <h1>Stats</h1>
             </div>
            <p className={styles.text}> Files: 101</p>
            <p>Free Storage: 10 GB</p>
            <p>Storage Used:70 GB</p>
        </div>
    )
}
