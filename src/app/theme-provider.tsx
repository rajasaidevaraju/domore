'use client';

import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        const media = window.matchMedia(DARK_QUERY);

        // data-theme always holds a concrete value, so globals.css never has to
        // consult the OS preference itself
        const apply = () => {
            const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
            root.setAttribute('data-theme', resolved);
        };

        apply();

        if (theme !== 'system') {
            return;
        }
        // only while following the OS does a live switch need to propagate
        media.addEventListener('change', apply);
        return () => media.removeEventListener('change', apply);
    }, [theme]);

    return <>{children}</>;
}
