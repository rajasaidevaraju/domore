'use client'
import styles from "./Card.module.css";


const UploadCard=()=>{
    const handleFileUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file);
            // You can add further logic here to handle the uploaded file, e.g., send it to a server.
        }
    };

    return(    
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <p>{"Upload File"}</p>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.commonButton} ${styles.button}`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        <img src="/svg/upload.svg" alt="Add" />
                    </button>
                    <input
                        id="fileInput"
                        type="file"
                        accept="video/*, .mkv"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                </div>
            </div>
            
        </div>
    )

}

export default UploadCard 