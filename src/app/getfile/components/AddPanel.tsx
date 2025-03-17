import { useEffect, useState } from "react";
import styles  from "./../GetFile.module.css";
import RippleButton from "@/app/types/RippleButton";
import { FilterRequests } from "@/app/service/FilterRequests";
import { EntityType, Item, MessageType } from "@/app/types/Types";
interface AddPerformerPanelProps {
    onClose: () => void;
    onSave: (performerId:number) => void;
    showToast: (message: string, type: MessageType) => void;
}

function AddPerformerPanel({onClose,onSave,showToast}:AddPerformerPanelProps) {
    const [name,setName]=useState<string>("");
    const [performers,setPerformers]=useState<Item[]|null>(null);
    const [filteredPerformers, setFilteredPerformers] = useState<Item[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const fetchPerformers = async () => {
        try {
            const data = await FilterRequests.fetchItems(EntityType.Performer);
            setPerformers(data);
        } catch (err) {
            let message="Failed to fetch performers"
            if(err instanceof Error){
            message=err.message;
            }
            showToast(message,MessageType.DANGER);
        }
    };
    
    function savePerformer(){
        if(selectedId!=null){
            onSave(selectedId);
        }
    }

    useEffect(()=>{fetchPerformers();},[]);
    useEffect(() => {
        if(selectedId!=null){
            setFilteredPerformers([]);
        }else{
            if (performers) {
                setFilteredPerformers(
                    performers.filter((performer) =>
                        performer.name.toLowerCase().includes(name.toLowerCase())
                    )
                );
            }
        }
       
    }, [name, performers,selectedId]);

    const handleSuggestionClick = (suggestion: string,id:number) => {
        setName(suggestion);
        setSelectedId(id);
    };

    return (
        <div className={styles.buttonsDiv}>
            <input
                type="text"
                placeholder="Performer name"
                value={name}
                onChange={(e) => {setName(e.target.value);}}
                className={styles.input}
                disabled={selectedId != null} />
             {name.length>0 && filteredPerformers.length > 0 && (
                <div className={styles.suggestions}>
                    {filteredPerformers.map((performer) => (
                        <div
                            key={performer.id}
                            className={styles.suggestionItem}
                            onClick={() => handleSuggestionClick(performer.name,performer.id)}
                        >
                            {performer.name}
                        </div>
                    ))}
                </div>
            )}
            
            <RippleButton className={`${styles.scbutton}`} disabled={selectedId == null} onClick={savePerformer}><img src="/svg/yes.svg" alt="save" /></RippleButton>
            <RippleButton className={`${styles.scbutton}`} onClick={onClose}><img src="/svg/cancel.svg" alt="Cancel" /></RippleButton>
        </div>

    );



}

export default AddPerformerPanel;