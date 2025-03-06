'use client'

import React, { useState } from 'react';
import styles from './login.module.css';
import { ToastData, MessageType } from "@/app/types/Types";
import ToastMessage from "@/app/types/ToastMessages";
import RippleButton from '../types/RippleButton';
import {ServerRequest} from '@/app/service/ServerRequest';
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
    const router = useRouter();

    const showToast = (message: string, type: MessageType) => {
        const id = Date.now();
        const newMessage: ToastData = { id, message, type };
        setToasts((prev) => [...prev, newMessage]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const containsHtmlTags = (input: string) => {
        const regex = /<[^>]*>?/gm;
        return regex.test(input);
    };

    const checkUsernameCharacters = (username: string) => {

        if(username.length==0){
            setUsernameError('Username cannot be empty.');
            return false;
        }
        if (containsHtmlTags(username)) {
            setUsernameError('HTML tags are not permitted in the username.');
            return false;
        } else if (!/^[a-zA-Z]+$/.test(username)) {
            setUsernameError('Username should only contain alphabets.');
            return false;
        } else {
            setUsernameError('');
            return true;
        }
    };

    const checkPasswordCharacters = (password: string) => {
        if(password.length==0){
            setPasswordError('Password cannot be empty.');
            return false;
        }
        if (containsHtmlTags(password)) {
            setPasswordError('HTML tags are not permitted in the password.');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const checkUsernameLength = (username: string) => {
        if (username.length > 10) {
            setUsernameError('Username should not exceed 10 characters.');
            return false;
        } else if (username.length < 4) {
            setUsernameError('Username should be at least 4 characters long.');
            return false;
        } else {
            setUsernameError('');
            return true;
        }
    };

    const checkPasswordLength = (password: string) => {
        if (password.length > 10) {
            setPasswordError('Password should not exceed 10 characters.');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Password should be at least 6 characters long.');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const handleLogin = async () => {

        setUsernameError('');
        setPasswordError('');
        setLoginError('');

        const isUsernameValid = checkUsernameCharacters(username) && checkUsernameLength(username);
        const isPasswordValid = checkPasswordCharacters(password) && checkPasswordLength(password);
        
        if (isUsernameValid && isPasswordValid) {
            try {
                let {token,error}=await ServerRequest.loginUser(username, password);
                if(error!=null){
                    setLoginError(error);
                }
                if(token!=null){
                    localStorage.setItem('token',token);
                    showToast('Login successful', MessageType.SUCCESS);
                    router.push('/');

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