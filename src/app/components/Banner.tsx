'use client'

import React from 'react';
import styles from './Banner.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import management from './../../../public/images/management.svg'
import filter from './../../../public/images/filter.svg'
const Banner = () => {

  const router = useRouter();
  const handleClick = (url:string) => {
    // Redirect to the server URL with the fileId parameter
    router.push(url);
    };

    return (
        <div className={styles.banner}>
          
           <div className={styles.icon_container} onClick={() => handleClick("/")}>
            <Image src={filter} alt="Filter" className={styles.icon}/>
            <span className={styles.icon_text}>Home</span>
          </div> 
          
          <div className={`${styles.icon_container} ${styles['item-to-start']}`}>
            <Image src={filter} alt="Filter" className={styles.icon}/>
            <span className={styles.icon_text}>Filter</span>
          </div>
          <div className={styles.icon_container} onClick={() => handleClick("/management")}>
            <Image src={management} alt="Management" className={styles.icon}/>
            <span className={styles.icon_text}>Management</span>
          </div>
        </div>
  );
};

export default Banner;

