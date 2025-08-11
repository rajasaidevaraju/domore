'use client';

import React, { useState, useEffect } from 'react';
import Video from '../../types/Video';
import {thumbnailCache} from '@/app/types/Types'
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import Link from 'next/link';
import Loading from '@/app/loading';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {

  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cleanedString = video.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {

    if (thumbnailCache.has(video.fileId)) {
      setImageData(thumbnailCache.get(video.fileId)!);
      setIsLoading(false);
      return;
    }

    const fetchThumb = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requestData = await ServerRequest.fetchThumbnail(video.fileId.toString());
        if (requestData.exists) {
          thumbnailCache.set(video.fileId, requestData.imageData);
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

   

  }, [video.fileId]);



  const renderThumbnail = () => {
    if (isLoading) {
     
      return (
         <div className={styles.placeholderDiv}>
            <Loading noText={true}/>
          </div>
      );
    }
    if (error) {
       return (
          <div className={styles.placeholderDiv}>
            <p className='errorText'>Error</p>
          </div>
       );
    }
    if (imageData) {
      
      return <img src={imageData} alt={`Thumbnail of ${cleanedString}`} className={styles.thumbnail} />;
    }
   
    return (
       <div className={styles.placeholderDiv}>
         <p>No Thumbnail</p>
       </div>
    );
  };

  return (

    <Link href={`/file/${video.fileId}`} className={styles.videoCardLink}>
      <div
        className={styles.videoCard}
        title={cleanedString}
      >
        {renderThumbnail()}
        <h2 className={styles.cardText}>{cleanedString}</h2>
      </div>
    </Link>
  );
}