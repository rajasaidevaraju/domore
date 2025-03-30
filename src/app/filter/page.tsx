"use client"

import React,{useState,useEffect} from "react";
import PerformersCard from "./components/Performers";
import CategoriesCard from "./components/Categories";
import { ToastData,ToastMessageDetails } from "@/app/types/Types";
import ToastMessage from "@/app/types/ToastMessages";

const Filter=()=>{

    const [toasts, setToasts] = useState<ToastData[]>([]);

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
            <PerformersCard showToast={showToast}/>
            <CategoriesCard showToast={showToast}/>
            {toasts.length > 0 && (<ToastMessage toasts={toasts} onClose={removeToast} />)}
        </div>
    )
}

export default Filter;