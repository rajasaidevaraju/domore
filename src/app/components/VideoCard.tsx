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
    // change defualt to false and un comment the useeffect block for lazy loading of thumbnails
    const [isVisible, setIsVisible] = useState(true);
    const [imageData, setImageData] = useState<string | null>(null); 
    const [requestMade, setRequestMade] = useState(false); // Track if request is made

    /*useEffect(() => {
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

    },[]);*/
    

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
      if((isVisible && !requestMade)||imageData!=null){
        try{
          (async ()=>{
            setRequestMade(true);
            console.log("request thumbnai for "+video.fileId)
            var requestData = await ServerRequest.requestThumbnail(video.fileId.toString())  
            if(requestData.exists){
              setImageData(requestData.imageData)
            }
            
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
        <img key={"placeholder"+video.fileId} onClick={handleVideoClick} src={imageData} alt="Thumbnail of the video" />
      ) : (
        <Image
          key={"image"+video.fileId}
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

