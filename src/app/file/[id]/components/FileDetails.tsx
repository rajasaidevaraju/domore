"use client";

import React, { useState } from "react";
import { useNavStore } from "@/app/store/navigation";
import { useRouter } from "next/navigation";
import styles from "../File.module.css";
import { useAuthStore } from "@/app/store/auth";
import { MessageType, Item } from "@/app/types/Types";
import RippleButton from "@/app/types/RippleButton";
import PressableLink from "@/app/types/PressableLink";
import PerformerPanel from "./PerformerPanel";
import DeletePanel from "./DeletePanel";
import EditNamePanel from "./EditNamePanel";
import ToastMessage from "@/app/types/ToastMessages";
import { ServerRequest } from "@/app/service/ServerRequest";

interface FileDetailsProps {
  initPerformers: Item[];
  fileId: string;
  initFileName: string;
  downloadLink: string;
}

export default function FileDetails({ initPerformers, fileId, initFileName, downloadLink }: FileDetailsProps) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";
  const { page, performerId, sortBy } = useNavStore();
  const { token, isLoggedIn } = useAuthStore();
  const [performers, setPerformers] = useState<Item[]>(initPerformers);
  const [fileName, setFileName] = useState(isDev ? "This should be file name" : initFileName);
  const [addPanel, setAddPanel] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [insertThumbnailLoading, setInsertThumbnailLoading] = useState(false);

  const showToast = (message: string, type: MessageType) => {
    const newMessage = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newMessage]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handlePanelClose = (updatedPerformers: Item[]) => {
    setPerformers(updatedPerformers);
    setAddPanel(false);
  };

  const handleTakeScreenshot = async () => {
    if (token != null) {
      const videoElement = document.querySelector("video");
      if (!videoElement) {
        showToast("Invalid File ID", MessageType.WARNING);
        return;
      }
      try {
        setInsertThumbnailLoading(true);
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.5));
        if (!blob) throw new Error("Failed to create thumbnail blob");
        await ServerRequest.uploadThumbnail(fileId, blob, token);
        showToast("Screenshot set as Thumbnail", MessageType.SUCCESS);
      } catch (error: Error | any) {
        if (error instanceof Error) {
          showToast(error.message, MessageType.DANGER);
        }
        console.error("Error taking screenshot:", error);
      } finally {
        setInsertThumbnailLoading(false);
      }
    }
  };

  const handleDeleteClick = () => {
    if (token != null) {
      setShowDeleteConfirmation(true);
    }
  };

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
  };

  const handleNameSave = async (newName: string) => {

    if (isDev) {
      return;
    }

    setIsEditingName(false);
    try {
      if (token == null) {
        throw new Error("Unauthorized access. Please Login");
      }

      let response = await ServerRequest.updateFileName(fileId, newName, token);
      const updatedFileDetails = await ServerRequest.fetchfileDetails(fileId);
      setPerformers(updatedFileDetails.performers);
      setFileName(updatedFileDetails.name);
      showToast(response.message, MessageType.SUCCESS);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, MessageType.DANGER);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={styles.buttonsDiv}>
        {isEditingName && isLoggedIn ? (
          <EditNamePanel name={fileName} onClose={handleNameCancel} onSave={handleNameSave} />
        ) : (
          <p className={styles.name}>{fileName}</p>
        )}
      </div>

      <RippleButton className={styles.scbutton} onClick={handleDownload}>
        Download Video
      </RippleButton>

      <div className={styles.buttonsDiv}>
        <p>Performers: </p>
        {performers === undefined || performers.length < 1 ? (
          <p>No Performers</p>
        ) : (
          performers.map((performer) => (
            <PressableLink href={`/files?performerId=${performer.id}`} className={styles.scbutton} key={performer.id}>
              <p>{performer.name}</p>
            </PressableLink>
          ))
        )}
      </div>

      {isLoggedIn && addPanel && (
        <PerformerPanel
          fileId={fileId}
          token={token}
          currentPerformers={performers}
          onClose={handlePanelClose}
          showToast={showToast}
        />
      )}

      {isLoggedIn && (
        <div className={styles.buttonsDiv}>
          <p>Actions: </p>
          <RippleButton className={styles.scbutton} onClick={handleTakeScreenshot} disabled={insertThumbnailLoading}>
            {insertThumbnailLoading ? "uploading Thumbnail" : "Set As Thumbnail"}
          </RippleButton>
          <RippleButton className={styles.scbutton} onClick={handleDeleteClick}>
            <p>&nbsp;Delete Video</p>
          </RippleButton>
          <RippleButton
            className={styles.scbutton}
            disabled={isEditingName}
            suggestion={isEditingName ? "Editing in progress" : undefined}
            onClick={handleEditNameClick}
          >
            <p>&nbsp;Edit Name</p>
          </RippleButton>
          <RippleButton className={`${styles.scbutton}`} onClick={() => setAddPanel(true)}>
            <p>&nbsp;Manage Performers</p>
          </RippleButton>
        </div>
      )}
      {showDeleteConfirmation && (
        <DeletePanel
          fileId={fileId}
          fileName={fileName}
          token={token}
          showToast={showToast}
          onClose={() => setShowDeleteConfirmation(false)}
        />
      )}
      {toasts.length > 0 && <ToastMessage toasts={toasts} onClose={removeToast} />}
    </>
  );
}