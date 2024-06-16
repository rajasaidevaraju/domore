'use client'

import React from 'react';
import Video from './Video';
import styles from './VideoCard.module.css';
import { useRouter } from 'next/navigation';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const router = useRouter();
    const serverAddress = process.env.SERVER_ADDRESS || '';
    const handleVideoClick = (fileId: number) => {
        // Redirect to the server URL with the fileId parameter
        router.push(`${serverAddress}/getfile/?fileId=${fileId}`);
    };

    return (
    <div className={styles.videoCard} onClick={() => handleVideoClick(video.fileId)}>
      <img
        src="https://via.placeholder.com/400x225/FFFFFF/FFFFFF?text=Image+Placeholder"
        alt="Image of the video"
      />
      <h2>{video.fileName}</h2>
    </div>
  );
};

export default VideoCard;

