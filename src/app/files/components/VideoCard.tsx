'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import { FileData } from '@/app/types/FileDataList';
import { formatSize, formatDuration } from '@/app/service/format';
import { claimGifPreview, releaseGifPreview } from './gifPreview';
import { isDevMode } from '@/app/service/env';
import Link from 'next/link';

const HOVER_INTENT_DELAY_MS = 200;
const HOLD_TO_PREVIEW_MS = 300;

interface VideoCardProps {
  file: FileData;
}

export default function VideoCard({ file }: VideoCardProps) {

  const isDev = isDevMode();
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const [gifLoading, setGifLoading] = useState(false);
  const formattedSize = useMemo(() => formatSize(file.fileSize), [file.fileSize]);
  const formattedDuration = useMemo(() => formatDuration(file.durationMs), [file.durationMs]);

  const hoverTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const previewingRef = useRef(false);
  const suppressNextClickRef = useRef(false);

  const suppressContextMenuRef = useRef(false);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {
    if (isDev) return;
    setThumbSrc(ServerRequest.thumbnailUrl(file.fileId));
  }, [file.fileId, isDev]);

  const stopPreview = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    previewingRef.current = false;

    setGifSrc(null);
    setGifLoading(false);
    releaseGifPreview(file.fileId);
  }, [file.fileId]);


  const startPreview = useCallback((delayMs: number = HOVER_INTENT_DELAY_MS) => {
    if (isDev || previewingRef.current) return;
    previewingRef.current = true;
    claimGifPreview(file.fileId, stopPreview);

    hoverTimerRef.current = window.setTimeout(() => {
      hoverTimerRef.current = null;
      setGifLoading(true);
      setGifSrc(ServerRequest.gifPreviewUrl(file.fileId));
    }, delayMs);
  }, [file.fileId, isDev, stopPreview]);

  useEffect(() => {
    return () => stopPreview();
  }, [stopPreview]);

  const cancelHoldTimer = () => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleTouchStart = () => {
    if (previewingRef.current) return;
    suppressNextClickRef.current = false;
    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      suppressNextClickRef.current = true;
      suppressContextMenuRef.current = true;
      startPreview(0);
    }, HOLD_TO_PREVIEW_MS);
  };

  // a moving finger is a scroll, not a hold — drop the pending timer but leave a
  // running preview alone, since holds jitter by a pixel or two
  const handleTouchMove = () => {
    cancelHoldTimer();
  };

  // touch has no mouseleave, so lifting off is the only signal that the hold is
  // over; without this a started preview would play until the card unmounts
  const handleTouchEnd = () => {
    cancelHoldTimer();
    suppressContextMenuRef.current = false;
    if (previewingRef.current) {
      stopPreview();
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (suppressNextClickRef.current) {
      event.preventDefault();
      suppressNextClickRef.current = false;
    }
  };

  return (
    <div
      className={styles.videoCard}
      title={cleanedString}
      onMouseEnter={() => startPreview()}
      onMouseLeave={stopPreview}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchEnd}
      onContextMenu={(event) => {
        if (suppressContextMenuRef.current) event.preventDefault();
      }}
      // iOS ignores contextmenu; toggle its link callout the same way
      style={{ WebkitTouchCallout: gifSrc ? 'default' : 'none' }}
    >
      <Link href={`/files/${file.fileId}`} onClick={handleClick}>
        <div className={styles.thumbnailBox}>
          {thumbSrc ? (
            <img
              src={thumbSrc}
              className={styles.thumbnail}
              loading="lazy"
              decoding="async"
              onError={() => setThumbSrc(null)}
            />
          ) : null}

          {gifSrc ? (
            <img
              src={gifSrc}
              className={styles.gifPreview}
              decoding="async"
              onLoad={() => setGifLoading(false)}
              onError={stopPreview}
            />
          ) : null}

          {gifLoading ? <span className={styles.gifLoadingBadge}>GIF</span> : null}

          <p className={styles.sizeText}>{formattedSize}</p>
          <p className={styles.durationText}>{formattedDuration}</p>
        </div>

        <h2 className={styles.cardTitle}>{isDev ? "This should be file name" : cleanedString}</h2>
      </Link>
    </div>
  );
}
