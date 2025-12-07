"use client"

import React,{useState} from "react";
import UploadCard from "./components/UploadCard";
import Stats from "./components/Stats";
import Operations from "./components/Operations";
import { ToastData,MessageType } from "../types/Types";
import ToastMessage from "@/app/types/ToastMessages";
import styles from "./components/management.module.css";
import { useAuthStore } from '@/app/store/auth';

const Management=()=>{
    const {isLoggedIn} = useAuthStore();
    const [toasts, setToasts] = useState<ToastData[]>([]);
    
    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = { id, message, type };
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <div className={styles.managementpanel}>
            {isLoggedIn && 
            <>
                <UploadCard/>
                <Operations showToast={showToast}/>
            </>
            }
            <Stats/>
            {toasts.length > 0 && <ToastMessage toasts={toasts} onClose={removeToast} />}
        </div>
    )

}

export default Management;
