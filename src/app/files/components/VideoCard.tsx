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
  // releasing a hold-to-preview fires a click; that click must not navigate
  const suppressNextClickRef = useRef(false);
  // set only for the hold gesture that starts a preview, so that gesture's
  // long-press menu is blocked but a later long-press shows it
  const suppressContextMenuRef = useRef(false);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  // src is assigned client-side only, so SSR markup never bakes in a URL
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
    // unmounting the img cancels any in-flight download
    setGifSrc(null);
    setGifLoading(false);
    releaseGifPreview(file.fileId);
  }, [file.fileId]);

  // delay filters out cursor sweeps across the grid; hold-to-preview passes 0
  // because the hold itself already proved intent
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

  // a quick tap navigates like any click; only a hold starts the preview.
  // While a preview is already playing, a second long-press is left to the
  // browser so its native menu (open in new tab, etc.) can appear.
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

  const handleTouchSettled = () => {
    cancelHoldTimer();
    suppressContextMenuRef.current = false;
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
      onTouchEnd={handleTouchSettled}
      onTouchMove={handleTouchSettled}
      onTouchCancel={handleTouchSettled}
      onContextMenu={(event) => {
        if (suppressContextMenuRef.current) event.preventDefault();
      }}
      // iOS ignores contextmenu; toggle its link callout the same way
      style={{ WebkitTouchCallout: gifSrc ? 'default' : 'none' }}
    >
      <Link href={`/file/${file.fileId}`} onClick={handleClick}>
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
