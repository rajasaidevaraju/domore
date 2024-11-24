import styles from './Home.module.css';

export default function Loading() {
    
    return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading content, please wait...</p>
        </div>
      );
}