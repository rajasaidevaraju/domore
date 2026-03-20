import styles from "../File.module.css";
import RippleButton from "@/app/types/RippleButton";
import { ServerRequest } from "@/app/service/ServerRequest";
import { MessageType } from "@/app/types/Types";
import { useRouter } from "next/navigation";
import { useNavStore } from "@/app/store/navigation";

interface DeletePanelProps {
    fileId: string;
    fileName: string;
    token: string | null;
    showToast: (message: string, type: MessageType) => void;
    onClose: () => void;
}

export default function DeletePanel({ fileId, fileName, token, showToast, onClose }: DeletePanelProps) {
    const router = useRouter();
    const { page, performerId, sortBy } = useNavStore();

    const handleConfirmDelete = async () => {
        onClose();
        if (token != null) {
            try {
                await ServerRequest.deleteVideo(fileId, token);
                let redirectUrl = `/?page=${page}`;
                if (performerId) {
                    redirectUrl += `&performerId=${performerId}`;
                }
                if (sortBy) {
                    redirectUrl += `&sortBy=${sortBy}`;
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

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <h2>Confirm Deletion</h2>
                </div>
                <div className={styles.body}>
                    <p>Are you sure you want to permanently delete the file {fileName}?</p>
                    <p>This action cannot be undone.</p>
                </div>
                <div className={styles.actions}>
                    <RippleButton className={styles.scbutton} onClick={onClose}>
                        <img src="/svg/cancel.svg" alt="Cancel" />
                        <p>&nbsp;Cancel</p>
                    </RippleButton>
                    <RippleButton className={styles.scbutton + " " + styles.confirmDeleteButton} onClick={handleConfirmDelete}>
                        <img src="/svg/delete.svg" alt="Delete" />
                        <p>&nbsp;Delete</p>
                    </RippleButton>
                </div>
            </div>
        </div>
    );
}