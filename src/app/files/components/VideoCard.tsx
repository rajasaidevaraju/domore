
import React from 'react';
import Video from '../../types/Video';
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import Link from 'next/link'

interface VideoCardProps {
  video: Video;
}
export default async function VideoCard({ video }: VideoCardProps){
  let imageData:string|null = null;
  const cleanedString=video.fileName.replace(/\.[a-zA-Z0-9]+$/, "")
   try{
        const requestData = await ServerRequest.fetchThumbnail(video.fileId.toString());
        if (requestData.exists) {
          imageData=requestData.imageData;
        }
      }catch (error) {
        console.error('Failed to fetch thumbnail for id' + video.fileId);
      }
  return (
    <Link href={`/file/${video.fileId}`} >
        <div
          className={styles.videoCard}
          title={cleanedString}
        >
          {imageData ? (
            <img src={imageData} alt="Thumbnail of the video" className={styles.thumbnail}/>
          ) : (
            <div className={styles.placeholderDiv}>
              <p> Thumbnail not created </p>
            </div>
          )}
          <h2 className={styles.cardText}>{cleanedString}</h2>
        </div>
      </Link>
  );
};
