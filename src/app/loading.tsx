import styles from './Home.module.css';

type LoadingProps={
  minHeight?:boolean
  text?:string
  noText?:boolean
}

export default function Loading({minHeight,text,noText}:LoadingProps) {
    
    return (
        <div className={`${styles.loadingContainer} ${minHeight? styles.minHeight:""}`}>
          <div className={styles.spinner}></div>
          {!noText &&  <p>{text?text:"Loading content, please wait..."}</p> }
        </div>
      );
}