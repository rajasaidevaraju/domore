import styles from './Banner.module.css'
import RippleButton from "@/app/types/RippleButton";
import Loading from '@/app/loading'
import { ServerRequest } from '@/app/service/ServerRequest';
import { useState,useEffect,useRef } from 'react';
import RippleButtonLink from '../types/RippleButtonLink';

interface ChangePanelProps{
    onClose: () => void;
}

const ChangePanel=(props:ChangePanelProps)=>{

    const [activeServers,setActiveServers]=useState<string[]>()
    const [showLoading,setShowLoading]=useState(true)
    const [error, setError] = useState<string | null>(null);
    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal;
        let requestActiveServers=async ()=>{
            try{
                setShowLoading(true)
                setError(null)
                let result=await ServerRequest.getActiveServersList(signal)
                
                setActiveServers(result)
                setShowLoading(false)
            }catch(error){
                if (error instanceof Error &&  error.name !== 'AbortError') {
                    setShowLoading(false)
                    setError('Failed to fetch list of Active servers');
                    console.error('Error:', error);
                }
            }
        }
        requestActiveServers()
        return () => {
            controller.abort();
        }
    },[])

    return (
    <div className={styles.panel}>
        <div className={styles.heading}>
            <h1>Change Server</h1>
            <RippleButton className={styles.changePanelButton} onClick={props.onClose}>Cancel</RippleButton>
        </div>
        {showLoading &&
        <Loading minHeight={true}></Loading>
        }
        {error!=null && (
        <p className={styles.errorText}>{error}</p>
        )}

        {error===null && activeServers!==undefined && (
            activeServers.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Server IP</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activeServers.map((item, index) => (
                        <tr key={index}>
                            <td>{item}</td>
                            <td><div className={styles.cell}><RippleButtonLink className={styles.changePanelButton} href={`http://${item}:1280`}>Navigate</RippleButtonLink></div></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No active servers available.</p>
            )
        )}
    </div>
    )
}

export default ChangePanel