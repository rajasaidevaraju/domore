'use client';

import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    return <>{children}</>;
}
