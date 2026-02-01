import { useEffect, useState, useRef } from "react";
import { ServerRequest } from "@/app/service/ServerRequest";
import { formatSize } from "@/app/service/format";
import styles from "./management.module.css";
import { useAuthStore } from '@/app/store/auth';
import { StorageLocation } from "@/app/types/Types";

interface ProgressTrackerProps {
  file: File;
  startUpload: boolean
  removeFile: (file: File) => void
  selectedStorage: StorageLocation
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ file, startUpload, removeFile, selectedStorage }) => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [uploadedChunks, setUploadedChunks] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [retry, setRetry] = useState<number>(0);
  const xhr = useRef<XMLHttpRequest | null>(null);
  const uploadStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [aborted, setAborted] = useState(false)
  const abortedRef = useRef(false);
  const { isLoggedIn, token } = useAuthStore();


  const handleFileUpload = async () => {

    if (token == null) {
      setError('Unauthorized');
      return;
    } else {
      setError(null);
    }

    if (file) {
      const CHUNK_SIZE = 2097152; //2 MB
      const fileSize = file.size || 0;
      const calculatedTotal = Math.max(1, Math.ceil(fileSize / CHUNK_SIZE));

      setTotalChunks(calculatedTotal);
      setUploadedChunks(0);
      setProgress(0);
      setSpeed(0);

      try {
        if (fileSize === 0 && file.name) {
          throw new Error("File size is 0 or inaccessible");
        }
        const status = await ServerRequest.getUploadStatus(file.name, file.size, CHUNK_SIZE, selectedStorage, token);

        if (!status || typeof status !== 'object') {
          throw new Error("Invalid response from server status check");
        }

        if (status.error) {
          setError(status.message || status.error);
          return;
        }

        const total = status.totalChunks || calculatedTotal;
        const uploaded = status.uploadedChunks ?? 0;
        const nextIndex = status.nextChunkIndex ?? uploaded;

        setTotalChunks(total);
        setUploadedChunks(uploaded);

        const initialProgress = total > 0 ? (uploaded / total) * 100 : 0;
        setProgress(initialProgress);

        if (status.status === "COMPLETED" || uploaded >= total) {
          setProgress(100);
          return;
        }

        let currentChunkIndex = nextIndex;

        while (currentChunkIndex < total) {
          if (abortedRef.current) {
            break;
          }

          setUploadedChunks(currentChunkIndex);
          const currentProgress = total > 0 ? (currentChunkIndex / total) * 100 : 0;
          setProgress(currentProgress);

          const start = currentChunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          let retryCount = 0;
          let success = false;
          let result: any;

          while (retryCount <= 2 && !success) {
            if (abortedRef.current) break;
            try {
              const startTime = Date.now();
              result = await ServerRequest.uploadChunk(
                chunk,
                currentChunkIndex,
                total,
                file.name,
                file.size,
                CHUNK_SIZE,
                selectedStorage,
                token,
                (xhrObj: XMLHttpRequest) => {
                  xhr.current = xhrObj;
                }
              );

              const endTime = Date.now();
              const timeElapsed = (endTime - startTime) / 1000;
              if (timeElapsed > 0) {
                const currentSpeed = chunk.size / timeElapsed;
                setSpeed(currentSpeed);
              }
              success = true;
            } catch (e) {
              retryCount++;
              setRetry(retryCount);
              if (retryCount > 2) throw e;
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (success) {
            setRetry(0);
            setUploadedChunks(result.uploadedChunks);
            setProgress(result.percentComplete);
            currentChunkIndex = result.uploadedChunks;

            if (result.status === "COMPLETED") {
              break;
            }
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError' || (error instanceof Error && error.message.includes('abort'))) {
        } else {
          setError(error instanceof Error ? error.message : 'Upload failed');
          console.error(`[ProgressTracker] Error:`, error);
        }
      }
    }
  };

  const stopUpload = () => {
    if (xhr.current != null) {
      xhr.current.abort()
    }
    setAborted(true)
    abortedRef.current = true;
    setTimeout(() => {
      removeFile(file)
    }, 300);

  }

  useEffect(() => {

    if (startUpload && !uploadStarted.current) {
      handleFileUpload()
      uploadStarted.current = true
    }

    return () => {
      if (xhr.current != null) {
        xhr.current.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startUpload])


  return (
    <div className={styles.tracker}>
      <div className={styles.infoRow}>
        <p className={`${styles.text} ${styles.left}`}>{file.name}</p>
        <button className={`${styles.removeButton} ${styles.commonButton} ${styles.right} ${aborted || progress === 100 ? styles.hidden : ''}`} onClick={stopUpload}>
          <img src="/svg/delete.svg" alt="Stop Upload" />
        </button>

      </div>

      <div className={styles.progressBar}>
        <div className={styles.filledBar} style={{ width: `${progress.toFixed(2)}%` }}></div>
      </div>
      <div className={styles.infoRow}>
        <p className={`${styles.text} ${styles.left}`}>{formatSize(file.size)}</p>
        {!aborted && !error && (
          <div className={styles.right}>
            {totalChunks > 0 ? (
              progress < 100 ? (
                <p className={styles.text}>
                  {retry > 0 && <span style={{ marginRight: '8px', color: '#ff9800' }}>Retry {retry}</span>}
                  <span style={{ marginRight: '8px' }}>
                    Part {uploadedChunks + 1} / {totalChunks}
                  </span>
                  <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                  {formatSize(speed)}/s
                </p>
              ) : (
                <p className={`${styles.text} ${styles.success}`}>Upload Success</p>
              )
            ) : startUpload ? (
              <p className={styles.text}>
                {totalChunks > 0 ? "Initializing..." : "Connecting to server..."}
              </p>
            ) : null}
          </div>
        )}
        {aborted && !error && <p className={`${styles.text} ${styles.right}`}>Upload Aborted</p>}
        {!aborted && error && (
          <div className={`${styles.right} ${styles.errorContainer}`}>
            <p className={`${styles.text} ${styles.error}`}>{error}</p>
            <button className={`${styles.commonButton} ${styles.retryButton}`} onClick={() => handleFileUpload()}>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;