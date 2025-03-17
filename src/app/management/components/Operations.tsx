import React from 'react';
import styles from "./management.module.css";
import RippleButton from '@/app/types/RippleButton';

const Operations: React.FC = () => {

    /*
    Scan Button: "This will scan the file system and add new files to the database."
    Cleanup Button: "This will remove any db entries not found in the file system."
    Migrate Button: "Broken file paths will be searched and updated."
    */
    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <h1>Server Operations</h1>
            </div>
           
            <div className={styles.trackerContainer}>
                <RippleButton className={styles.commonButton} suggestion='scan the server file system' >Scan</RippleButton>
                <RippleButton className={styles.commonButton} suggestion='remove any db entries not found in the file system'>Cleanup</RippleButton>
                <RippleButton className={styles.commonButton} suggestion='Broken file paths will be searched and updated.'>Migrate</RippleButton>
            </div>
            
        </div>
    );
};

export default Operations;