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

  const isDev = process.env.NODE_ENV === "development";
  const [imageData, setImageData] = useState<string | null>(null);
  const formattedSize = useMemo(() => formatSize(file.fileSize), [file.fileSize]);
  const formattedDuration = useMemo(() => formatDuration(file.durationMs), [file.durationMs]);

  const cleanedString = file.fileName.replace(/\.[a-zA-Z0-9]+$/, "");

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchThumb = async () => {
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

  return (
    <div className={styles.videoCard} title={cleanedString}>
      <Link href={`/file/${file.fileId}`}>
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

          <p className={styles.sizeText}>{formattedSize}</p>
          <p className={styles.durationText}>{formattedDuration}</p>
        </div>

        <h2 className={styles.cardTitle}>{isDev ? "This should be file name" : cleanedString}</h2>
      </Link>
    </div>
  );
}