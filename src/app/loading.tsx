import styles from './Home.module.css';

type LoadingProps={
  minHeight?:boolean
}

export default function Loading({minHeight}:LoadingProps) {
    
    return (
        <div className={`${styles.loadingContainer} ${minHeight? styles.minHeight:""}`}>
          <div className={styles.spinner}></div>
          <p>Loading content, please wait...</p>
        </div>
      );
}