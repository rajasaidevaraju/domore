'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { thumbnailCache } from '@/app/types/Types'
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import { FileData } from '@/app/types/FileDataList';
import { formatSize, formatDuration } from '@/app/service/format';
import { claimGifPreview, releaseGifPreview, getCachedGif, cacheGif } from './gifPreview';
import { isDevMode } from '@/app/service/env';
import Link from 'next/link';

const HOVER_INTENT_DELAY_MS = 200;

interface VideoCardProps {
  file: FileData;
}

export default function VideoCard({ file }: VideoCardProps) {

  const isDev = isDevMode();
  const [imageData, setImageData] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifLoading, setGifLoading] = useState(false);
  const formattedSize = useMemo(() => formatSize(file.fileSize), [file.fileSize]);
  const formattedDuration = useMemo(() => formatDuration(file.durationMs), [file.durationMs]);

  const gifUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const previewingRef = useRef(false);
  const blockNextClickRef = useRef(false);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchThumb = async () => {
      if (isDev) return;
      try {
        let blob = thumbnailCache.get(file.fileId);

        if (!blob) {
          const fetchedBlob = await ServerRequest.fetchThumbnail(file.fileId.toString());
          if (fetchedBlob && fetchedBlob.size > 0) {
            thumbnailCache.set(file.fileId, fetchedBlob);
            blob = fetchedBlob;
          }
        }

        if (blob && blob.size > 0) {
          objectUrl = URL.createObjectURL(blob);
          setImageData(objectUrl);
        } else {
          setImageData(null);
        }
      } catch (err) {
        setImageData(null);
      }
    };

    fetchThumb();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };

  }, [file.fileId]);

  const stopPreview = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    if (gifUrlRef.current) {
      URL.revokeObjectURL(gifUrlRef.current);
      gifUrlRef.current = null;
    }
    previewingRef.current = false;
    setGifUrl(null);
    setGifLoading(false);
    releaseGifPreview(file.fileId);
  }, [file.fileId]);

  const startPreview = useCallback(() => {
    if (isDev || previewingRef.current) return;
    previewingRef.current = true;
    claimGifPreview(file.fileId, stopPreview);

    // short delay so sweeping the cursor across the grid doesn't fire requests
    hoverTimerRef.current = window.setTimeout(async () => {
      hoverTimerRef.current = null;
      try {
        let blob = getCachedGif(file.fileId);
        if (!blob) {
          setGifLoading(true);
          const controller = new AbortController();
          abortRef.current = controller;
          const fetched = await ServerRequest.fetchGifPreview(file.fileId.toString(), controller.signal);
          abortRef.current = null;
          if (fetched && fetched.size > 0) {
            cacheGif(file.fileId, fetched);
            blob = fetched;
          }
        }
        if (blob && previewingRef.current) {
          const url = URL.createObjectURL(blob);
          gifUrlRef.current = url;
          setGifUrl(url);
        }
      } catch (err) {
      } finally {
        setGifLoading(false);
      }
    }, HOVER_INTENT_DELAY_MS);
  }, [file.fileId, isDev, stopPreview]);

  useEffect(() => {
    return () => stopPreview();
  }, [stopPreview]);

  const handleTouchStart = () => {
    blockNextClickRef.current = !previewingRef.current;
    startPreview();
  };

  const handleClick = (event: React.MouseEvent) => {
    if (blockNextClickRef.current) {
      event.preventDefault();
      blockNextClickRef.current = false;
    }
  };

  return (
    <div
      className={styles.videoCard}
      title={cleanedString}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onTouchStart={handleTouchStart}
    >
      <Link href={`/file/${file.fileId}`} onClick={handleClick}>
        <div className={styles.thumbnailBox}>
          {imageData ? (
            <img
              src={imageData}
              className={styles.thumbnail}
              onLoad={() => {
                if (imageData) URL.revokeObjectURL(imageData);
              }}
              onError={() => setImageData(null)}
            />
          ) : null}

          {gifUrl ? (
            <img src={gifUrl} className={styles.gifPreview} onError={stopPreview} />
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
