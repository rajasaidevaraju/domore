'use client'

import React, { useEffect, useRef, useState } from 'react';
import Video from './Video';
import Link from 'next/link';
import Image from 'next/image';
import styles from './VideoCard.module.css';
import { ServerRequest } from '../service/ServerRequest';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [requestMade, setRequestMade] = useState(false); // Track if request is made

  useEffect(() => {
    if (!requestMade || imageData != null) {
      try {
        (async () => {
          setRequestMade(true);
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
  }, [requestMade, video.fileId]);

  return (
    <Link href={`/getfile/?fileId=${video.fileId}`}>
      <div
        key={video.fileId + 'div'}
        ref={imageRef}
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
          <img
            key={'image' + video.fileId}
            src="/svg/noThumbnail.svg"
            alt="Thumbnail not created"
          />
        )}
        <h2>{video.fileName}</h2>
      </div>
    </Link>
  );
};

export default VideoCard;
