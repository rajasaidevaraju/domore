"use client"

import React,{useState,useEffect} from "react";
import PerformersCard from "./components/Performers";
import CategoriesCard from "./components/Categories";
import { ToastData,ToastMessageDetails } from "@/app/types/Types";
import ToastMessage from "@/app/types/ToastMessages";

const Filter=()=>{

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);
    const showToast = (toastDetails: ToastMessageDetails) => {
        const id = Date.now();
        const newMessage: ToastData = {id: Date.now(), ...toastDetails};
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <div>
            <PerformersCard isLoggedIn={isLoggedIn} showToast={showToast}/>
            <CategoriesCard isLoggedIn={isLoggedIn} showToast={showToast}/>
            {toasts.length > 0 && (<ToastMessage toasts={toasts} onClose={removeToast} />)}
        </div>
    )
}

export default Filter;