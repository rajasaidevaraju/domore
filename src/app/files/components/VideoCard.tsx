'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { thumbnailCache } from '@/app/types/Types'
import styles from './VideoCard.module.css';
import { ServerRequest } from '../../service/ServerRequest';
import { FileData } from '@/app/types/FileDataList';
import { formatSize, formatDuration } from '@/app/service/format';
import Link from 'next/link';

interface VideoCardProps {
  file: FileData;
}

export default function VideoCard({ file }: VideoCardProps) {

  const [imageData, setImageData] = useState<string | null>(null);
  const formattedSize = useMemo(() => formatSize(file.fileSize), [file.fileSize]);
  const formattedDuration = useMemo(() => formatDuration(file.durationMs), [file.durationMs]);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {

    if (thumbnailCache.has(file.fileId)) {
      setImageData(thumbnailCache.get(file.fileId)!);
      return;
    }

    const fetchThumb = async () => {
      try {
        const requestData = await ServerRequest.fetchThumbnail(file.fileId.toString());
        if (requestData.exists) {
          thumbnailCache.set(file.fileId, requestData.imageData);
          setImageData(requestData.imageData);
        } else {
          setImageData(null);
        }
      } catch (err) {
        setImageData(null);
      }
    };

    fetchThumb();

  }, [file.fileId]);

  return (
    <div className={styles.videoCard} title={cleanedString}>
      <Link href={`/file/${file.fileId}`}>
        <div className={styles.thumbnailBox}>
          {imageData ? (
            <img
              src={imageData}
              alt={`Thumbnail of ${cleanedString}`}
              className={styles.thumbnail}
            />
          ) : null}
          <p className={styles.sizeText}>{formattedSize}</p>
          <p className={styles.durationText}>{formattedDuration}</p>
        </div>

        <h2 className={styles.cardTitle}>{cleanedString}</h2>
      </Link>
    </div>
  );
}