"use client"

import React,{useState,useEffect} from "react";
import UploadCard from "./components/UploadCard";
import Stats from "./components/Stats";
import Operations from "./components/Operations";
import { ToastData,MessageType } from "../types/Types";
import ToastMessage from "@/app/types/ToastMessages";
import styles from "./components/management.module.css";
const Management=()=>{

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    };
    const [toasts, setToasts] = useState<ToastData[]>([]);
    
    
    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = { id, message, type };
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    useEffect(() => {
        checkLoginStatus();
        const storageListener = () => checkLoginStatus();
        window.addEventListener('storage', storageListener);

        return () => window.removeEventListener('storage', storageListener);
    }, []);

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