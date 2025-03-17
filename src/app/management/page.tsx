"use client"

import React,{useState,useEffect} from "react";
import UploadCard from "./components/UploadCard";
import Stats from "./components/Stats";
import Operations from "./components/Operations";
const Management=()=>{

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    };

    useEffect(() => {
        checkLoginStatus();
        const storageListener = () => checkLoginStatus();
        window.addEventListener('storage', storageListener);

        return () => window.removeEventListener('storage', storageListener);
    }, []);

    return (<div>
        {isLoggedIn && <UploadCard/>}
        <Operations/>
        <Stats/>
    </div>)

}

export default Management;