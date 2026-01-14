"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "../File.module.css";

import { formatTime } from "@/app/service/format";

interface VideoPlayerProps {
  videoSrc: string;
  fileId: string;
}

export default function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLInputElement>(null);
  const volumeSliderRef = useRef<HTMLInputElement>(null);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasVisibleRef = useRef(true);

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
      const vol = videoRef.current.volume;
      const muted = videoRef.current.muted;
      setVolume(vol);
      setIsMuted(muted);
      localStorage.setItem(videoMuted, muted.toString());
      if (!muted && vol > 0) {
        localStorage.setItem(videoVolume, vol.toString());
      }
    }
  }, []);

  const changeVolume = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
      setVolume(value);
      setIsMuted(value === 0);
      localStorage.setItem(videoVolume, value.toString());
      localStorage.setItem(videoMuted, (value === 0).toString());
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      localStorage.setItem(videoMuted, newMuted.toString());
    }
  };

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    // Explicitly blur the input to remove focus on mobile
    if (seekBarRef.current) {
      seekBarRef.current.blur();
    }
    if (isFullscreen) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (document.fullscreenElement) {
          setShowControls(false);
        }
      }, 4000);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeStart = () => {
    setIsAdjustingVolume(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleVolumeEnd = () => {
    setIsAdjustingVolume(false);
    if (volumeSliderRef.current) {
      volumeSliderRef.current.blur();
    }
    if (isFullscreen) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (document.fullscreenElement) {
          setShowControls(false);
        }
      }, 4000);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => {
          if (window.screen.orientation && (window.screen.orientation as any).lock) {
            (window.screen.orientation as any).lock("landscape").catch(() => { });
          }
        })
        .catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
      document.exitFullscreen();
    }
  };


  const showControlsWithTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      if (document.fullscreenElement || isFullscreen) {
        setShowControls(false);
      }
    }, 4000);
  }, [isFullscreen]);

  const handleTap = useCallback((e?: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (e) {
      e.stopPropagation();
      if (e.type === 'touchend' || e.type === 'pointerup') {
        const touchEvent = e as unknown as TouchEvent;
        if (touchEvent.cancelable && typeof touchEvent.preventDefault === 'function') {
          // Generally pointer events don't need preventDefault for clicks, 
          // but we want to stop simulated clicks if using touch.
        }
      }
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isActuallyFull = !!document.fullscreenElement;

    if (isActuallyFull) {
      if (isTouch) {
        if (wasVisibleRef.current && showControls) {
          setShowControls(false);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        } else {
          showControlsWithTimeout();
        }
      } else {
        if (showControls) {
          setShowControls(false);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        } else {
          showControlsWithTimeout();
        }
      }
    } else {
      if (!showControls) {
        setShowControls(true);
      }
      if (e && !isTouch) {
        togglePlay();
      }
    }
  }, [showControls, showControlsWithTimeout]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      wasVisibleRef.current = showControls;
      if (!showControls) {
        setShowControls(true);
      }
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  }, [showControls]);


  useEffect(() => {
    if (!showControls) {
      setShowSpeedMenu(false);
    }
  }, [showControls]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSpeedMenu) {
        setShowSpeedMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSpeedMenu]);

  const handleMouseMove = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    if (!showControls) {
      setShowControls(true);
    }

    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      if (document.fullscreenElement && !isSeeking && !isAdjustingVolume) {
        setShowControls(false);
      }
    }, 4000);
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
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(videoElement.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      applySettings();
    };

    const handlePlayPause = () => {
      setIsPlaying(!videoElement.paused);
    };

    applySettings();
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlayPause);
    videoElement.addEventListener("pause", handlePlayPause);
    videoElement.addEventListener(rateChange, handleRateChange);
    videoElement.addEventListener(volumeChange, handleVolumeChange);

    if (videoElement.readyState >= 1) {
      setDuration(videoElement.duration);
      applySettings();
    }

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (!isFull) {
        setShowControls(true);
      } else {
        showControlsWithTimeout();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "ArrowLeft" || e.key === "j" || e.key === "J") {
        skipPrev();
      } else if (e.key === "ArrowRight" || e.key === "l" || e.key === "L") {
        skipNext();
      } else if (e.key === ">" && e.shiftKey) {
        changeSpeed(Math.min(speed + 0.1, 2));
      } else if (e.key === "<" && e.shiftKey) {
        changeSpeed(Math.max(speed - 0.1, 0.5));
      } else if (e.key === " " || e.key === "k" || e.key === "K") {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlayPause);
      videoElement.removeEventListener("pause", handlePlayPause);
      videoElement.removeEventListener(rateChange, handleRateChange);
      videoElement.removeEventListener(volumeChange, handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoSrc, handleRateChange, handleVolumeChange, speed, isSeeking, isAdjustingVolume, isPlaying, showControlsWithTimeout, isFullscreen]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`${styles.videoDiv} ${isFullscreen ? styles.isFullscreen : ""}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <video
        key={videoSrc}
        crossOrigin="anonymous"
        ref={videoRef}
        className={styles.videoElement}
        src={videoSrc}
        onPointerDown={handlePointerDown}
        onPointerUp={handleTap}
        onDoubleClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {isFullscreen && (
        <div
          className={styles.tapOverlay}
          onPointerDown={handlePointerDown}
          onPointerUp={handleTap}
        />
      )}

      <div
        className={`${styles.customControlBar} ${isFullscreen ? styles.fullscreenControlBar : ""} ${!showControls ? styles.hideControls : ""}`}
      >
        <div className={styles.seekbarRow}>
          <span className={styles.timeDisplay}>{formatTime(currentTime)}</span>
          <div className={styles.seekbarContainer}>
            <div
              className={styles.seekbarProgress}
              style={{ width: `${progress}%` }}
            />
            <input
              ref={seekBarRef}
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
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

        <div className={styles.controlButtonsRow}>
          <button className={styles.scbutton} onClick={togglePlay}>
            <img src={isPlaying ? "/svg/pause.svg" : "/svg/play.svg"} alt={isPlaying ? "Pause" : "Play"} className={styles.controlIcon} />
          </button>
          <button className={styles.scbutton} onClick={skipPrev} title="Skip Backward 10s">
            -10
          </button>
          <div className={styles.speedContainer}>
            <button
              className={styles.scbutton}
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeedMenu(!showSpeedMenu);
              }}
            >
              {speed}x
            </button>
            {showSpeedMenu && (
              <div className={styles.speedMenu} onClick={(e) => e.stopPropagation()}>
                {[0.7, 0.8, 1, 1.25, 2].map((s) => (
                  <div
                    key={s}
                    className={`${styles.speedOption} ${speed === s ? styles.speedOptionActive : ""}`}
                    onClick={() => {
                      changeSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                  >
                    {s === 1 ? "Normal" : `${s}x`}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className={styles.scbutton} onClick={skipNext} title="Skip Forward 10s">
            +10
          </button>
          <div className={styles.volumeDiv}>
            <button className={styles.scbutton} onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
              <img
                src={isMuted ? "/svg/volume-mute.svg" : volume < 0.5 ? "/svg/volume-low.svg" : "/svg/volume-high.svg"}
                alt={isMuted ? "Unmute" : "Mute"}
                className={styles.controlIcon}
              />
            </button>
            <input
              ref={volumeSliderRef}
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              onMouseDown={handleVolumeStart}
              onMouseUp={handleVolumeEnd}
              onTouchStart={handleVolumeStart}
              onTouchEnd={handleVolumeEnd}
              className={`${styles.volumeSlider} ${isAdjustingVolume ? styles.adjusting : ""}`}
            />
          </div>
          <button className={styles.scbutton} onClick={toggleFullscreen}>
            <img
              src={isFullscreen ? "/svg/fullscreen-exit.svg" : "/svg/fullscreen.svg"}
              alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className={styles.controlIcon}
            />
          </button>
        </div>
      </div>
    </div>
  );
}