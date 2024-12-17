'use client'

import React from 'react';
import styles from './Banner.module.css';
import Link from 'next/link';
const Banner = () => {

    return (
      <div className={styles.banner}>
        <Link href="/" className={styles.icon_container}>
            <img src="/svg/home.svg" alt="Filter" className={styles.icon} />
            <span className={styles.icon_text}>Home</span>
        </Link>
        <Link href="/filter" className={`${styles.icon_container} ${styles['item-to-start']}`}>
            <img src="/svg/filter.svg" alt="Filter" className={styles.icon} />
            <span className={styles.icon_text}>Filter</span>
        </Link>
        <Link href="/management" className={styles.icon_container}>
            <img src="/svg/management.svg" alt="Management" className={styles.icon} />
            <span className={styles.icon_text}>Management</span>
        </Link>
        {/*<div className={`${styles.icon_container}`}>
            <img src="/svg/switch.svg" alt="Change Server" className={styles.icon} />
            <span className={styles.icon_text}>Change Server</span>
        </div>*/}
    </div>
  );
};

export default Banner;

