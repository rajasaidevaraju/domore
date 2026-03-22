import { useState, useRef, ChangeEvent, useEffect, KeyboardEvent } from "react";
import styles from "./../File.module.css";
import RippleButton from "@/app/types/RippleButton";
import { validateFileName } from "@/app/service/validate";
import { MessageType } from "@/app/types/Types";

interface EditNamePanelProps {
    name: string;
    onClose: () => void;
    onSave: (name: string) => void;
    showToast: (message: string, type: MessageType) => void;
}

function EditNamePanel({ name, onClose, onSave, showToast }: EditNamePanelProps) {
    const [newName, setNewName] = useState<string>(name);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(0, textareaRef.current.value.lastIndexOf('.'));
            adjustHeight();
        }
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [newName]);

    function adjustHeight() {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const changedName = event.target.value.replace(/[\n\r]/g, "");
        setNewName(changedName);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            saveNewName();
        } else if (event.key === "Escape") {
            onClose();
        }
    }

    function saveNewName() {
        const validationError = validateFileName(newName, true);
        if (validationError) {
            showToast(validationError, MessageType.DANGER);
            return;
        }
        onSave(newName.trim());
    }

    return (
        <div className={styles.namePanelDiv}>
            <textarea
                placeholder="File name"
                value={newName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={styles.textarea}
                ref={textareaRef}
                rows={1}
            />
            <div className={styles.buttonsDiv}>
                <RippleButton className={`${styles.scbutton}`} onClick={saveNewName}>
                    <img src="/svg/yes.svg" alt="save" />
                    <p>&nbsp;Save</p>
                </RippleButton>
                <RippleButton className={`${styles.scbutton}`} onClick={onClose}>
                    <img src="/svg/cancel.svg" alt="Cancel" />
                    <p>&nbsp;Cancel</p>
                </RippleButton>
            </div>
        </div>
    );
}

export default EditNamePanel;
