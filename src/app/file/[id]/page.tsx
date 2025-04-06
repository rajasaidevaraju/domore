import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import FileDetails from "./components/FileDetails";
import { ServerRequest } from "../../service/ServerRequest";
import { ServerUrlProvider } from "@/app/service/UrlProvider";
import { FileDetails as FileDetailsType } from "@/app/types/Types";
import styles from "./File.module.css";

type pageParams=Promise<{id:string}>

export async function generateMetadata({ params }: { params: pageParams }) {
  const { id } = await params;
  const API_BASE_URL = ServerUrlProvider();
  try {
    const result = await ServerRequest.fetchfileDetails(id);
    return {
      title: result.name || `File ${id}`,
      description: `Details for file ${id}`,
      openGraph: {
        images: [`${API_BASE_URL}/server/thumbnail?fileId=${id}`],
      },
    };
  } catch (error) {
    return {
      title: `File ${id} - Error`,
      description: "Error fetching file details",
    };
  }
}

export default async function FilePage({ params }: { params: pageParams}) {
  const { id } = await params;
  const API_BASE_URL = ServerUrlProvider();

  try {
    const result: FileDetailsType = await ServerRequest.fetchfileDetails(id);
    const videoSrc = `${API_BASE_URL}/server/file?fileId=${id}`;

    return (
      <div className={styles.videoContainer}>
        <VideoPlayer videoSrc={videoSrc} fileId={id} />
        <FileDetails fileDetails={result} fileId={id} fileName={result.name} />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <p>Error loading video: {error instanceof Error ? error.message : "An unknown error occured"}</p>
      </div>
    );
  }
}