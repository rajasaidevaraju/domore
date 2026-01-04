"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "../File.module.css";
import RippleButton from "@/app/types/RippleButton";

interface VideoPlayerProps {
  videoSrc: string;
  fileId: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);

  const rateChange = "ratechange";
  const volumeChange = "volumechange";
  const videoVolume = "videoVolume";
  const videoMuted = "videoMuted";
  const videoPlaybackSpeed = "videoPlaybackSpeed";

  const handleRateChange = useCallback(() => {
    if (videoRef.current) {
      const newSpeed = videoRef.current.playbackRate;
      localStorage.setItem(videoPlaybackSpeed, newSpeed.toString());
      setSpeed(newSpeed);
    }
  }, []);

  const handleVolumeChange = useCallback(() => {
    if (videoRef.current) {
      const volume = videoRef.current.volume;
      const isMuted = videoRef.current.muted;
      localStorage.setItem(videoMuted, isMuted.toString());
      if (!isMuted && volume > 0) {
        localStorage.setItem(videoVolume, volume.toString());
      }
    }
  }, []);

  const changeSpeed = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
      setSpeed(value);
      localStorage.setItem(videoPlaybackSpeed, value.toString());
    }
  };

  const skipPrev = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const skipNext = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration || videoRef.current.currentTime + 10
      );
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const applySettings = () => {
      const playbackRate = parseFloat(localStorage.getItem(videoPlaybackSpeed) ?? "1");
      const storedVolume = parseFloat(localStorage.getItem(videoVolume) ?? "1");
      const storedMuted = localStorage.getItem(videoMuted) === "true";

      videoElement.playbackRate = playbackRate >= 0.5 && playbackRate <= 2.0 ? playbackRate : 1;
      videoElement.volume = Math.min(Math.max(storedVolume, 0.1), 1);
      videoElement.muted = storedMuted;
      setSpeed(videoElement.playbackRate);
    };

    applySettings();
    videoElement.addEventListener("loadedmetadata", applySettings);
    videoElement.addEventListener(rateChange, handleRateChange);
    videoElement.addEventListener(volumeChange, handleVolumeChange);
    if (videoElement.readyState >= 1) {
      applySettings();
    }

    return () => {
      videoElement.removeEventListener("loadedmetadata", applySettings);
      videoElement.removeEventListener(rateChange, handleRateChange);
      videoElement.removeEventListener(volumeChange, handleVolumeChange);
    };
  }, [videoSrc, handleRateChange, handleVolumeChange]);

  return (
    <div className={styles.videoDiv}>
      <video
        key={videoSrc}
        crossOrigin="anonymous"
        ref={videoRef}
        controls
        className={styles.videoElement}
        src={videoSrc}
      >
        Your browser does not support the video tag.
      </video>
      <div className={styles.controlDiv}>
        <RippleButton className={styles.scbutton} onClick={skipPrev}>
          Skip Prev
        </RippleButton>
        <div className={styles.speedDiv}>
          <label>Speed: </label>
          <select
            value={speed}
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            className={styles.speedSelect}
          >
            <option value={0.7}>0.70</option>
            <option value={0.8}>0.80</option>
            <option value={0.9}>0.90</option>
            <option value={1}>1</option>
            <option value={1.2}>1.20</option>
          </select>
        </div>
        <RippleButton className={styles.scbutton} onClick={skipNext}>
          Skip Next
        </RippleButton>
      </div>
    </div>
  );
}