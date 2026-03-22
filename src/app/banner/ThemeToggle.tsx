'use client'
import React, { useState, useEffect } from "react";

import { useThemeStore } from '../store/themeStore';
import RippleButton from '../types/RippleButton';
import styles from './Banner.module.css';

const ThemeToggle = ({ isMobile }: { isMobile?: boolean }) => {
    const { theme, setTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        if (!mounted) return;
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    const getIconText = () => {
        if (!mounted) return 'Theme: ...';
        if (theme === 'system') return 'System';
        if (theme === 'light') return 'Light';
        return 'Dark';
    };

    const buttonStyle = `${styles.actionItem} ${isMobile ? styles.actionItemMobile : ''}`;

    return (
        <RippleButton className={buttonStyle} onClick={toggleTheme}>
            <img src="/svg/switch.svg" alt="Theme" className={styles.icon} />
            <span className={styles.iconText}>{getIconText()}</span>
        </RippleButton>
    );
};

export default ThemeToggle;
