import { ServerRequest } from "@/app/service/ServerRequest";
import VideoCard from "./VideoCard";
import Pagination from "./Pagination";
import styles from "@/app/files/Files.module.css";
import { FileFilters } from "../filterParams";

export default async function VideoList({ filters }: { filters: FileFilters }) {

    const { page, performerId, sortBy, unassignedOnly } = filters;

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

                {meta.total > 1 && <Pagination meta={meta} filters={filters} />}
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
