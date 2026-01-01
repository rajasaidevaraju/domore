import React from 'react';
import styles from './filter.module.css';

const Skeleton = () => {
    return (
        <div className={`${styles.cardList} ${styles.contentFadeIn}`}>
            {[...Array(12)].map((_, index) => (
                <div key={index} className={styles.skeletonItem} style={{ width: `${Math.floor(Math.random() * 40) + 80}px` }}></div>
            ))}
        </div>
    );
};

export default Skeleton;
