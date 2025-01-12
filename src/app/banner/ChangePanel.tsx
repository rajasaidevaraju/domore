import styles from './Banner.module.css'
import RippleButton from "@/app/types/RippleButton";
import Loading from '@/app/loading'
import { ServerRequest } from '@/app/service/ServerRequest';
import { useState,useEffect } from 'react';
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
        const {signal} = controller;
        let requestActiveServers=async ()=>{
            try{
                let result=await ServerRequest.getActiveServersList(signal)
                setActiveServers(result)
                setShowLoading(false)
            }catch(error){
                setShowLoading(false)
                setError('Failed to fetch list of Active servers');
                console.error('Error:', error);
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
            <RippleButton className={styles.cancelButton} onClick={props.onClose}>Cancel</RippleButton>
        </div>
        {showLoading &&
        <Loading></Loading>
        }
        {error!=null && (
        <p className={styles.errorText}>{error}</p>
        )}

        {error===null && activeServers!==undefined && (
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
                        <td><div className={styles.cell}><RippleButtonLink className={styles.actionItem} href={`http://${item}:1280`}>Navigate</RippleButtonLink></div></td>
                    </tr>
                    ))}
                </tbody>
            </table>
            
        )}
       
    </div>
    )
}

export default ChangePanel