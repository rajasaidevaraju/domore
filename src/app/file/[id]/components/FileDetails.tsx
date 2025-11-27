"use client";

import React, { useState } from "react";
import { useNavStore } from "@/app/store/navigation";
import { useRouter } from "next/navigation";
import styles from "../File.module.css";
import { useAuthStore } from "@/app/store/auth";
import { FilterRequests } from "../../../service/FilterRequests";
import { EntityType, MessageType, Item, FileDetails as FileDetailsType } from "@/app/types/Types";
import RippleButton from "@/app/types/RippleButton";
import PressableLink from "@/app/types/PressableLink";
import AddPerformerPanel from "./AddPanel";
import EditNamePanel from "./EditNamePanel";
import ToastMessage from "@/app/types/ToastMessages";
import { ServerRequest } from "@/app/service/ServerRequest";

interface FileDetailsProps {
  initPerformers: Item[];
  fileId: string;
  initFileName: string;
  downloadLink:string;
}

export default function FileDetails({initPerformers, fileId, initFileName,downloadLink }: FileDetailsProps) {
  const router = useRouter();
  const { page,  performerId, sortBy } = useNavStore();
  const { token, isLoggedIn } = useAuthStore();
  const [performers, setPerformers] = useState<Item[]>(initPerformers);
  const [fileName, setFileName] = useState(initFileName);
  const [addPanel, setAddPanel] = useState(false);  
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [insertThumbnailLoading,setInsertThumbnailLoading]=useState(false)


  const showToast = (message: string, type: MessageType) => {
    const newMessage = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newMessage]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const savePerformer = async (performerId: number) => {
    try {
      setAddPanel(false);
      if (token == null) {
        throw new Error("Unauthorized access. Please Login");
      }
      if (isNaN(Number(fileId))) {
        throw new Error("Invalid File ID");
      } else {
        showToast("Request sent to Server", MessageType.SUCCESS);
        let response = await FilterRequests.addItemToFile(
          Number(fileId),
          performerId,
          EntityType.Performer,
          token
        );
        if (response.message) {
          const updatedFileDetails = await ServerRequest.fetchfileDetails(fileId);
          setPerformers(updatedFileDetails.performers);
          showToast(response.message, MessageType.SUCCESS);
        }
      }
    } catch (error) {
      let message = `Failed to add performer to file ${fileId}`;
      if (error instanceof Error) {
        message = error.message;
      }
      showToast(message, MessageType.DANGER);
    }
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
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(videoElement, { allowTaint: true });
        const imageData = canvas.toDataURL("image/jpeg", 0.3);
        await ServerRequest.uploadThumbnail(fileId, imageData, token);
        showToast("Screenshot set as Thumbnail", MessageType.SUCCESS);
      } catch (error: Error | any) {
        if (error instanceof Error) {
          showToast(error.message, MessageType.DANGER);
        }
        console.error("Error taking screenshot:", error);
      }
      finally{
        setInsertThumbnailLoading(false);
      }
    }
  };

  const handleDeleteClick = () => {
    if (token != null) {
      setShowDeleteConfirmation(true);
    }
  };


  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    if (token != null) {
      try {
        await ServerRequest.deleteVideo(fileId, token);
        let redirectUrl = `/?page=${page}`;
        if (performerId) {
          redirectUrl += `&performerId=${performerId}`;
        }
        if(sortBy){
          redirectUrl+=`&sortBy=${sortBy}`
        }
        router.push(redirectUrl);
      } catch (error: Error | any) {
        if (error instanceof Error) {
          showToast(error.message, MessageType.DANGER);
        }
        console.error("Error while deleting video:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
  };

  const handleNameSave = async (newName: string) => {
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
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = fileName;
    link.style.display = 'none';
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
        {isLoggedIn && (
          <>
            {addPanel ? (
              <AddPerformerPanel onClose={() => setAddPanel(false)} onSave={savePerformer} showToast={showToast} />
            ) : (
              <RippleButton className={`${styles.scbutton}`} onClick={() => setAddPanel(true)}>
                <img src="/svg/add.svg" alt="Add" />
                <p>&nbsp;Add</p>
              </RippleButton>
            )}
          </>
        )}
      </div>
      {isLoggedIn && (
        <div className={styles.buttonsDiv}>
          <p>Actions: </p>
          <RippleButton className={styles.scbutton} onClick={handleTakeScreenshot} disabled={insertThumbnailLoading}>
            {insertThumbnailLoading?"uploading Thumbnail":"Set As Thumbnail"}
          </RippleButton>
          <RippleButton className={styles.scbutton} onClick={handleDeleteClick}>
             <img src="/svg/delete.svg" alt="Delete" /><p>&nbsp;Delete Video</p>
          </RippleButton>
          <RippleButton className={styles.scbutton} disabled={isEditingName} suggestion={isEditingName ? "Editing in progress" : undefined}
          onClick={handleEditNameClick}>
            <img src="/svg/edit.svg" alt="Edit" /><p>&nbsp;Edit Name</p>
          </RippleButton>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationDialog}>
            <div className={styles.confirmationHeader}>
              <h2>Confirm Deletion</h2>
            </div>
            <div className={styles.confirmationBody}>
              <p>Are you sure you want to permanently delete the file {fileName}?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className={styles.confirmationActions}>
              <RippleButton className={styles.scbutton} onClick={handleCancelDelete}>
                <img src="/svg/cancel.svg" alt="Cancel" /><p>&nbsp;Cancel</p>
              </RippleButton>
              <RippleButton className={styles.scbutton} onClick={handleConfirmDelete}>
                <img src="/svg/delete.svg" alt="Delete" /><p>&nbsp;Delete</p>
              </RippleButton>
            </div>
          </div>
        </div>
      )}
      {toasts.length > 0 && <ToastMessage toasts={toasts} onClose={removeToast} />}
    </>
  );
}