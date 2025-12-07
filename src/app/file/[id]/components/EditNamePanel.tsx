import {useState, useRef, ChangeEvent } from "react";
import styles  from "./../File.module.css";
import RippleButton from "@/app/types/RippleButton";
import { validateFileName } from "@/app/service/validate";

interface EditNamePanelProps {
    name:string;
    onClose: () => void;
    onSave: (name:string) => void;
}

function EditNamePanel({name,onClose,onSave}:EditNamePanelProps) {
    const [newName,setNewName]=useState<string>(name);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    function setName(event:ChangeEvent<HTMLInputElement>){
        let changedName=event.target.value;
        setNewName(changedName);
        const validationError = validateFileName(changedName,false);
        if (validationError) {
            setErrorMessage(validationError);
        } else {
            setErrorMessage(null);
        }
    }
    function saveNewName() {
        const validationError = validateFileName(newName,true);
        if (validationError) {
          setErrorMessage(validationError);
          return;
        }
        setErrorMessage(null);
        onSave(newName.trim());
    }
    
    return (
        <div className={styles.namePanelDiv}>
            
            <input
                type="text"
                placeholder="File name"
                value={newName}
                onChange={setName}
                className={styles.input}
                ref={inputRef} />
            <div className={styles.buttonsDiv}>
                <RippleButton className={`${styles.scbutton}`} onClick={saveNewName}><img src="/svg/yes.svg" alt="save" /><p>&nbsp;Save</p></RippleButton>
                <RippleButton className={`${styles.scbutton}`} onClick={onClose}><img src="/svg/cancel.svg" alt="Cancel" /><p>&nbsp;Cancel</p></RippleButton>
            </div>
            <div className={styles.errorMessageContainer}>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>
            
        </div>

    );

}

export default EditNamePanel;