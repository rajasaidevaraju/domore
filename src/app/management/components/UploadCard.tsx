'use client'
import styles from "./Card.module.css";


const UploadCard=()=>{
    const handleFileUpload = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file);
            const formData = new FormData();
            formData.append("video", file); // 'video' matches the field name expected by the server

        try {
            const response = await fetch("http://localhost:5000/server/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("File uploaded successfully:", result);
            } else {
                console.error("Failed to upload file. Server responded with:", response.status);
            }
        } catch (error) {
            console.error("An error occurred while uploading the file:", error);
        }finally {
            event.target.value = '';
        }
        }
    };

    return(    
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <h1>{"Upload File"}</h1>
                <div className={styles.buttons}>
                    <button
                        className={`${styles.commonButton} ${styles.button}`}
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        <img src="/svg/upload.svg" alt="Add" />
                        <p>Choose</p>
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