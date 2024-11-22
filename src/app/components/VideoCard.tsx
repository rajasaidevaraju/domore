'use client'

import React, { useEffect, useRef, useState } from 'react';
import Video from './Video';
import Link from 'next/link';
import styles from './VideoCard.module.css';
import { ServerRequest } from '../service/ServerRequest';
import { useRouter } from 'next/navigation';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const requestMadeRef = useRef(false);
  const router = useRouter();

  function navigate(event: React.MouseEvent<HTMLAnchorElement>){
    let url=`/getfile?fileId=${video.fileId}`;
    console.log(url)
    event.preventDefault(); // Optional: Prevent navigation for testing
    router.push(url)
  }

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
        // Do nothing
      }
    }


  return (
    <Link onClick={navigate} href={`/getfile/?fileId=${video.fileId}`} key={`/getfile/?fileId=${video.fileId}`} >
      <div
        key={video.fileId + 'div'}
        className={styles.videoCard}
      >
        {imageData ? (
          <img
            height={270}
            width={150}
            key={'placeholder' + video.fileId}
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
    </Link>
  );
};

export default VideoCard;
