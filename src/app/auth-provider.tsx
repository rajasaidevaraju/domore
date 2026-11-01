"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import {UserRequests} from "@/app/service/UserRequests";

import Loading from "./loading";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {setAuth, clearAuth, expireSession, token, authLoading, setAuthLoading } = useAuthStore();
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setAuthLoading(false);
                return;
            }
            setAuthLoading(true);
            const res = await UserRequests.verifyToken(token);
            if(!res.isTokenValid){
                clearAuth();
            }else if(!res.unreachable){
                setAuth(true,res.username,res.token);
            }
            
            setAuthLoading(false);
        };

        verifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        const onVisibilityChange = async () => {
            if (document.visibilityState !== "visible" || !token) {
                return;
            }
            const res = await UserRequests.verifyToken(token);
            if (!res.isTokenValid) {
                expireSession();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return <>{children}</>;
};

export default AuthProvider;
