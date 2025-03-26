import React,{useState} from 'react';
import styles from "./management.module.css";
import RippleButton from '@/app/types/RippleButton';
import { OperationRequests } from '@/app/service/OperationRequests';
import { MessageType } from '@/app/types/Types';

interface OperationsProps {
    showToast: (message: string, type: MessageType) => void;
}

const Operations: React.FC<OperationsProps> = ({showToast}:OperationsProps) => {

    const [isScanning, setIsScanning] = useState(false);
    const [isRepair,setIsRepair]=useState(false);

    let scanningToolTip= isScanning?"Scanning in progress":undefined;
    let repairToolTip=isRepair?"Repair in progress":undefined;
    const handleScan = async () => {
        setIsScanning(true);
        try{
            let token=localStorage.getItem('token');
            if(token===null){
                showToast("Unauthorized access", MessageType.DANGER);
            }else{
                let data= await OperationRequests.fetchScan(token);
                showToast(data.message, MessageType.SUCCESS);
            }
       }catch(error){
            if(error instanceof Error){
                showToast(error.message, MessageType.DANGER);
                
            }else{
                showToast('An error occurred on scan request.', MessageType.DANGER);
                console.error('Error:', error);
            }
       }finally{
            setIsScanning(false);
       }
        
    };

    const handleCleanup = () => {
        console.log("Cleaning up database...");
       
    };

    const handleReset = async () => {
       
        setIsRepair(true);
        try{
            let token=localStorage.getItem('token');
            if(token===null){
                showToast("Unauthorized access", MessageType.DANGER);
            }else{
                let data= await OperationRequests.fetchRepair(token);
                showToast(data.message, MessageType.SUCCESS);
            }
       }catch(error){
            if(error instanceof Error){
                showToast(error.message, MessageType.DANGER);
                
            }else{
                showToast('An error occurred on scan request.', MessageType.DANGER);
                console.error('Error:', error);
            }
       }finally{
            setIsRepair(false);
       }
       
    };


    return (
        <div className={styles.cardContainer}>
        <div className={styles.header}>
            <h1>Server Operations</h1>
        </div>
       
        <div className={styles.itemContainer}>
            <div className={`${styles.operationItem} ${styles.borderBottom}`}>
                <RippleButton suggestion={scanningToolTip} className={`${styles.commonButton} ${styles.minWidth}`} onClick={handleScan} disabled={isScanning}>
                    Scan
                </RippleButton>
                <p className={styles.explanation}>This will scan the file system and add new files to the database.</p>
            </div>
            <div className={`${styles.operationItem} ${styles.borderBottom}`}>
                <RippleButton  className={`${styles.commonButton} ${styles.minWidth}`}  onClick={handleCleanup}>
                    Cleanup
                </RippleButton>
                <p className={styles.explanation}>This will remove any db entries not found in the file system.</p>
            </div>
            <div className={styles.operationItem}>
                <RippleButton suggestion={repairToolTip} className={`${styles.commonButton} ${styles.minWidth}`} onClick={handleReset}>
                    Repair
                </RippleButton>
                <p className={styles.explanation}>Broken file paths will be searched and updated.</p>
            </div>
        </div>
    </div>
    );
};

export default Operations;