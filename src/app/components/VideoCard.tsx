'use client'

import React, { useEffect, useRef, useState } from 'react';
import Video from './Video';
import Image from 'next/image';
import styles from './VideoCard.module.css';
import { useRouter } from 'next/navigation';
import { ServerRequest } from '../service/ServerRequest';
import noThumbnail from './../../../public/images/noThumbnail.svg'


interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    const router = useRouter();
    const imageRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null); 
    const [requestMade, setRequestMade] = useState(false); // Track if request is made

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
            setIsVisible(entry.isIntersecting);
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.3, // trigger when 30% of target is visible
        }
        
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
          observer.unobserve(imageRef.current);
      }
  };

    },[]);

    const handleVideoClick = () => {
        // Redirect to the server URL with the fileId parameter
        //router.push(`getfile/?fileId=${video.fileId}`);
        const newTab = window.open();
        if(newTab!=null){
          newTab.opener = null; // Ensure no access to the parent window
          newTab.location.href = `getfile/?fileId=${video.fileId}`;
        }
        
    };

    useEffect(()=>{
      if(isVisible && !requestMade){
        try{
          (async ()=>{
            var requestData = await ServerRequest.requestThumbnail(video.fileId.toString())  
            if(requestData.exists){
              setImageData(requestData.imageData)
            }
            setRequestMade(true);
          })()
        }catch(error){
          console.log("Failed to fethch thumbnail for id"+ video.fileId)
          //do nothing
        }
      }
    },[isVisible, requestMade, video.fileId])

    return (
      
      <div key={video.fileId} ref={imageRef} className={styles.videoCard}>
      {imageData ? (
        <img onClick={handleVideoClick} src={imageData} alt="Thumbnail of the video" />
      ) : (
        <Image
          onClick={handleVideoClick}
          priority
          src={noThumbnail}
          alt="Thumbnail not created"
        />
      )}
      <h2>{video.fileName}</h2>
    </div>
     
    
   
  );
};

export default VideoCard;

