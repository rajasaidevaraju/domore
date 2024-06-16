'use client'

import React from 'react';
import styles from './Banner.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const Banner = () => {

  const router = useRouter();
  const handleClick = () => {
    // Redirect to the server URL with the fileId parameter
    router.push("/management");
    };

    return (
        <div className={styles.banner}>
          <div className={styles.icon_container}>
            <img src="/filter.svg" alt="Filter" className={styles.icon} />
            <span className={styles.icon_text}>Filter</span>
          </div>
          <div className={styles.icon_container} onClick={handleClick}>
            <img src="/management.svg" alt="Management" className={styles.icon} />
            <span className={styles.icon_text}>Management</span>
          </div>
        </div>
  );
};

export default Banner;

