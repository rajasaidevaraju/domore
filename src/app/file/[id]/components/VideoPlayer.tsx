"use client";

import React, { useRef, useEffect } from "react";
import styles from "../File.module.css";

interface VideoPlayerProps {
  videoSrc: string;
  fileId: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const rateChnage = "ratechange";
  const volumeChange = "volumechange";
  const videoVolume = "videoVolume";
  const videoMuted = "videoMuted";
  const videoPlaybackSpeed = "videoPlaybackSpeed";

  const handleRateChange = () => {
    if (videoRef.current) {
      const speed = videoRef.current.playbackRate;
      localStorage.setItem(videoPlaybackSpeed, speed.toString());
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      let volume = videoRef.current.volume;
      const isMuted = videoRef.current.muted;
      localStorage.setItem(videoMuted, isMuted.toString());
      if (!isMuted && volume > 0) {
        localStorage.setItem(videoVolume, volume.toString());
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = videoSrc;
      videoElement.load();

      const playbackRate = parseFloat(localStorage.getItem(videoPlaybackSpeed) ?? "1");
      const storedVolume = parseFloat(localStorage.getItem(videoVolume) ?? "1");
      const storedMuted = localStorage.getItem(videoMuted) === "true";

      videoElement.playbackRate =
        playbackRate >= 0.5 && playbackRate <= 2.0 ? playbackRate : 1;
      videoElement.volume = Math.min(Math.max(storedVolume, 0.1), 1);
      videoElement.muted = storedMuted;

      videoElement.addEventListener(rateChnage, handleRateChange);
      videoElement.addEventListener(volumeChange, handleVolumeChange);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener(rateChnage, handleRateChange);
        videoElement.removeEventListener(volumeChange, handleVolumeChange);
      }
    };
  }, [videoSrc]);

  return (
    <video crossOrigin="anonymous" ref={videoRef} controls className={styles.videoElement}>
      <source src="null" type="video/mp4" />
    </video>
  );
}