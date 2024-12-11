'use client'

import React, { useEffect, useRef, useState } from 'react';
import Video from '../../types/Video';
import Link from 'next/link';
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const requestMadeRef = useRef(false);

  useEffect(() => {
    if (!requestMadeRef.current && !imageData) {
      try {
        (async () => {
          requestMadeRef.current = true;
          const requestData = await ServerRequest.requestThumbnail(video.fileId.toString());
          if (requestData.exists) {
            setImageData(requestData.imageData);
          }
        })();
      } catch (error) {
        console.error('Failed to fetch thumbnail for id' + video.fileId);
      }
    }
  }, [imageData]);

  return (
    <a href={`/getfile?fileId=${video.fileId}`} >
        <div
          className={styles.videoCard}
        >
          {imageData ? (
            <img
              height={270}
              width={150}
              src={imageData}
              alt="Thumbnail of the video"
            />
          ) : (
            <div className={styles.placeholderDiv}>
              <p> Thumbnail not created </p>
            </div>
          )}
          <h2>{video.fileName}</h2>
        </div>
      </a>
  );
};

export default VideoCard;
