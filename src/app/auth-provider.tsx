"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth";
import {UserRequests} from "@/app/service/UserRequests";

import Loading from "./loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {setAuth, clearAuth, token, authLoading, setAuthLoading } = useAuthStore();
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setAuthLoading(false);
                return;
            }
            setAuthLoading(true);
            const res = await UserRequests.verifyToken(token);
            if(res.isTokenValid){
                setAuth(true,res.username,res.token);
            }else{
                clearAuth();
            }
            
            setAuthLoading(false);
        };

        verifyToken();
    }, [token]);

    if (authLoading) return <Loading text="Checking Login Status ..."/>;

    return <>{children}</>;
};

export default AuthProvider;
