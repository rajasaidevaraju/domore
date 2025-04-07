"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth";
import {UserRequests} from "@/app/service/UserRequests";

import Loading from "./loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {setAuth, clearAuth, token } = useAuthStore();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            const res = await UserRequests.verifyToken(token);
            if(res.isTokenValid){
                setAuth(true,res.username,res.token);
            }else{
                clearAuth();
            }
            
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    if (loading) return <Loading/>;

    return <>{children}</>;
};

export default AuthProvider;
