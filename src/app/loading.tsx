import styles from './Home.module.css';

type LoadingProps={
  minHeight?:boolean
  text?:string
}

export default function Loading({minHeight,text}:LoadingProps) {
    
    return (
        <div className={`${styles.loadingContainer} ${minHeight? styles.minHeight:""}`}>
          <div className={styles.spinner}></div>
          <p>{text?text:"Loading content, please wait..."}</p>
        </div>
      );
}