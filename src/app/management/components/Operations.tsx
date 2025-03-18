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
    let scanningToolTip= isScanning?"Scanning in progress":undefined;
    const handleScan = async () => {
        setIsScanning(true);
        try{
            let data= await OperationRequests.fetchScan();
            showToast(data.message, MessageType.SUCCESS);
            //showToast("success", MessageType.SUCCESS);

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

    const handleMigrate = () => {
        console.log("Migrating file paths...");
       
    };


    return (
        <div className={styles.cardContainer}>
        <div className={styles.header}>
            <h1>Server Operations</h1>
        </div>
       
        <div className={styles.itemContainer}>
            <div className={styles.operationItem}>
                <RippleButton suggestion={scanningToolTip} className={styles.commonButton} onClick={handleScan} disabled={isScanning}>
                    Scan
                </RippleButton>
                <p className={styles.explanation}>This will scan the file system and add new files to the database.</p>
            </div>
            <div className={styles.operationItem}>
                <RippleButton className={styles.commonButton} onClick={handleCleanup}>
                    Cleanup
                </RippleButton>
                <p className={styles.explanation}>This will remove any db entries not found in the file system.</p>
            </div>
            <div className={styles.operationItem}>
                <RippleButton className={styles.commonButton} onClick={handleMigrate}>
                    Migrate
                </RippleButton>
                <p className={styles.explanation}>Broken file paths will be searched and updated.</p>
            </div>
        </div>
    </div>
    );
};

export default Operations;