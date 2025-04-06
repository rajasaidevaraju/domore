"use client";

import React, { useState } from "react";
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
}

export default function FileDetails({ initPerformers, fileId, initFileName }: FileDetailsProps) {
  const { token, isLoggedIn } = useAuthStore();
  const [performers, setPerformers] = useState<Item[]>(initPerformers);
  const [fileName, setFileName] = useState(initFileName);
  const [addPanel, setAddPanel] = useState(false);  
  const [isEditingName, setIsEditingName] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const showToast = (message: string, type: MessageType) => {
    const id = Date.now();
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
    }
  };

  const deleteVideo = async () => {
    if (token != null) {
      try {
        if (confirm("Do you want to delete the file!")) {
          await ServerRequest.deleteVideo(fileId, token);
          window.location.href = "/";
        }
      } catch (error: Error | any) {
        if (error instanceof Error) {
          showToast(error.message, MessageType.DANGER);
        }
        console.error("Error while deleting video:", error);
      }
    }
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

  return (
    <>
      <div className={styles.buttonsDiv}>
        {isEditingName && isLoggedIn ? (
          <EditNamePanel name={fileName} onClose={handleNameCancel} onSave={handleNameSave} />
        ) : (
          <p className={styles.name}>{fileName}</p>
        )}
      </div>

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
          <RippleButton className={styles.scbutton} onClick={handleTakeScreenshot}>
            Set As Thumbnail
          </RippleButton>
          <RippleButton className={styles.scbutton} onClick={deleteVideo}>
            Delete Video
          </RippleButton>
          <RippleButton
            className={styles.scbutton}
            disabled={isEditingName}
            suggestion={isEditingName ? "Editing in progress" : undefined}
            onClick={handleEditNameClick}
          >
            <img src="/svg/edit.svg" alt="Edit" />
            <p>&nbsp;Edit Name</p>
          </RippleButton>
        </div>
      )}
      {toasts.length > 0 && <ToastMessage toasts={toasts} onClose={removeToast} />}
    </>
  );
}