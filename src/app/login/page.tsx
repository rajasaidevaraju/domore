'use client'

import React, { use, useState } from 'react';
import styles from './Login.module.css';
import {validateUsername,validatePassword} from '@/app/service/validate'
import { ToastData, MessageType } from "@/app/types/Types";
import ToastMessage from "@/app/types/ToastMessages";
import RippleButton from '../types/RippleButton';
import {UserRequests} from '@/app/service/UserRequests';
import { useAuthStore } from '@/app/store/auth';
import { useRouter } from 'next/navigation';
import EyeIcon from './eyeIcon';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const {token,setAuth} =useAuthStore();
    const router = useRouter();


    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = { id, message, type };
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const checkUsernameCharacters = (username: string,includesLength:boolean=false) => {
        
        let error= validateUsername(username,includesLength)
        if(error==null){
            setUsernameError('');
            return true;
        }else{
            setUsernameError(error);
            return false;
        }
    };

    const checkPasswordCharacters = (password: string,includesLength:boolean=false) => {
       
        let error=validatePassword(password,includesLength)
        if(error==null){
            setPasswordError('');
            return true;
        }else{
            setPasswordError(error);
            return false;
        }
    };


    const handleLogin = async () => {

        setUsernameError('');
        setPasswordError('');
        setLoginError('');

        const isUsernameValid = checkUsernameCharacters(username,true)
        const isPasswordValid = checkPasswordCharacters(password,true)
        
        if (isUsernameValid && isPasswordValid) {
            try {
                let {token,error}=await UserRequests.loginUser(username, password);
                if(error!=null){
                    setLoginError(error);
                }
                if(token!=null){
                    setAuth(true,username,token);
                    showToast('Login successful', MessageType.SUCCESS);
                    const lastPage = sessionStorage.getItem('lastPage');
                    if (lastPage) {
                        router.push(lastPage);
                        sessionStorage.removeItem('lastPage');
                    }else{
                        router.push("/")
                    }

                }
            } catch (error) {
                if (error instanceof Error) {
                    showToast(error.message, MessageType.DANGER);
                }
                console.error('Login error:', error);
            }
        }
    };

    return (
        <div className={styles.mainContainer}>
        <div className={styles.container}>
            <h2 className={styles.title}>Login</h2>
            <p className="errorText">{loginError}</p>
            <div className={styles.inputGroup}>
            <div>
                <label className={styles.label}>Username:</label>
                <input
                    type="text"
                    placeholder='Enter username'
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        checkUsernameCharacters(e.target.value);
                    }}
                    className={styles.input}
                />
                <p className="errorText">{usernameError}</p>
            </div>
            <div>
                <label className={styles.label}>Password:</label>
                <div className={styles.passwordContainer}>
                    <input type={showPassword ? "text" : "password"} value={password}
                        placeholder='Enter password'
                        onChange={(e) => {
                            setPassword(e.target.value);
                            checkPasswordCharacters(e.target.value);
                        }}
                        className={`${styles.input} ${styles.passwordInput}`}
                    />
                    <EyeIcon showPassword={showPassword} setShowPassword={setShowPassword} />
                </div>
                <p className="errorText">{passwordError}</p>
            </div>
            </div>
            <RippleButton onClick={handleLogin} className={styles.button}>Login</RippleButton>
            {toasts.length > 0 && <ToastMessage toasts={toasts} onClose={removeToast} />}
        </div>
        </div>
    );
};

export default Login;