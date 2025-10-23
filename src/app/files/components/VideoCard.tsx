'use client';

import React, { useState, useEffect,useMemo } from 'react';
import {thumbnailCache} from '@/app/types/Types'
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import Link from 'next/link';
import Loading from '@/app/loading';
import { FileData } from '@/app/types/FileDataList';
import { formatSize } from '@/app/service/formatSize';

interface VideoCardProps {
  file: FileData;
}

export default function VideoCard({ file }: VideoCardProps) {

  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const formattedSize=useMemo(() => formatSize(file.fileSize), [file.fileSize]);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {

    if (thumbnailCache.has(file.fileId)) {
      setImageData(thumbnailCache.get(file.fileId)!);
      setIsLoading(false);
      return;
    }

    const fetchThumb = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requestData = await ServerRequest.fetchThumbnail(file.fileId.toString());
        if (requestData.exists) {
          thumbnailCache.set(file.fileId, requestData.imageData);
          setImageData(requestData.imageData);
        } else {
          setImageData(null); 
        }
      } catch (err) {
        setError('Failed to load thumbnail');
        setImageData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumb();

   

  }, [file.fileId]);



  const renderThumbnail = () => {
    if (isLoading) {
      return (
        <div className={styles.placeholderDiv}>
          <p className={styles.sizeText}>{formattedSize}</p> 
          <p>No Thumbnail</p>
       </div>
      );
    }
    if (error) {
       return (
          <div className={styles.placeholderDiv}>
            <p className={styles.sizeText}>{formattedSize}</p> 
            <p className='errorText'>Error</p>
          </div>
       );
    }
    if (imageData) {
      
      return(
        <div className={styles.placeholderDiv}>
          <img src={imageData} alt={`Thumbnail of ${cleanedString}`} className={styles.thumbnail}/>
          <p className={styles.sizeText}>{formattedSize}</p> 
        </div>
        
      ) 
      ;
    }
    
    /*return (
       <div className={styles.placeholderDiv}>
          <p className={styles.sizeText}>{formattedSize}</p> 
          <p>No Thumbnail</p>
       </div>
    );*/
  };

  return (

    <Link href={`/file/${file.fileId}`} className={styles.videoCardLink}>
      <div
        className={styles.videoCard}
        title={cleanedString}
      >
        {renderThumbnail()}
        <h2 className={styles.cardText}>{cleanedString}</h2>
        {/*<h2 className={styles.cardText}>Title</h2>*/}
      </div>
    </Link>
  );
}