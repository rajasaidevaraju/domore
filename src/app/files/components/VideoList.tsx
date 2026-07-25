import { ServerRequest } from "@/app/service/ServerRequest";
import VideoCard from "./VideoCard";
import Pagination from "./Pagination";
import styles from "@/app/files/Files.module.css";

interface VideoListProps {
    page: number;
    performerId: number | null;
    sortBy?: string;
    unassignedOnly?: boolean;
}

export default async function VideoList({ page, performerId, sortBy, unassignedOnly }: VideoListProps) {

    try {

        const filesDataList = await ServerRequest.fetchFiles(page, performerId ?? undefined, sortBy, unassignedOnly);
        const fileData = filesDataList.data;
        const meta = filesDataList.meta;

        return (
            <>
                <div className={styles.videosContainer}>
                    {fileData.map((file) => (
                        <VideoCard key={file.fileId} file={file} />
                    ))}
                </div>

                {meta.total > 1 && <Pagination meta={meta} performerId={performerId} sortBy={sortBy} unassignedOnly={unassignedOnly} />}
            </>
        );
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : 'Error fetching files';
        return (
            <main className={styles.mainContainer}>
                <div className={styles.innerContainer}>
                    <p className="errorText">{errorMessage}</p>
                </div>
            </main>
        );
    }

}
