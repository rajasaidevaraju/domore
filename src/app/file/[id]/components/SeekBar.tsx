"use client";

import { useRef, useState, useEffect } from "react";
import styles from "../File.module.css";
import { formatTime } from "@/app/service/format";

interface SeekBarProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

export default function SeekBar({ videoRef, onSeekStart, onSeekEnd }: SeekBarProps) {
  const seekBarRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
    const handleLoadedMetadata = () => setDuration(videoElement.duration);

    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (videoElement.readyState >= 1) {
      setDuration(videoElement.duration);
      setCurrentTime(videoElement.currentTime);
    }

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  const handleSeekStart = () => {
    setDragTime(currentTime);
    setIsSeeking(true);
    onSeekStart?.();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDragTime(parseFloat(e.target.value));
  };

  const handleSeekEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = dragTime;
    }
    setCurrentTime(dragTime);
    setIsSeeking(false);
    seekBarRef.current?.blur();
    onSeekEnd?.();
  };

  const displayTime = isSeeking ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className={styles.seekbarRow}>
      <span className={styles.timeDisplay}>{formatTime(displayTime)}</span>
      <div className={styles.seekbarContainer}>
        <div className={styles.seekbarProgress} style={{ width: `${progress}%` }} />
        <input
          ref={seekBarRef}
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={displayTime}
          onChange={handleSeekChange}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          className={`${styles.seekbar} ${isSeeking ? styles.seeking : ""}`}
        />
      </div>
      <span className={styles.timeDisplay}>{formatTime(duration)}</span>
    </div>
  );
}
