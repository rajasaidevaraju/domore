'use client'
import React, { useState, useEffect } from "react";

import { useThemeStore, Theme } from '../store/themeStore';
import styles from './Banner.module.css';

/*
 * Inlined rather than <img src="/svg/…">: as separate files these three either
 * pop in after first paint, or — when masked, which is what the accent colour
 * needed — paint as a solid block until the mask resource lands. Inline they
 * arrive with the markup, and currentColor tracks --secondary-color for free.
 */
const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.68,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const SystemIcon = ({ className }: { className?: string }) => (
    <svg className={className} {...iconProps}>
        <rect x="2.6" y="3.6" width="18.8" height="13.2" rx="1.8" />
        <path d="M12 16.8V20.4" />
        <path d="M8.4 20.4H15.6" />
    </svg>
);

const LightIcon = ({ className }: { className?: string }) => (
    <svg className={className} {...iconProps}>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4V4.2" />
        <path d="M12 19.8V21.6" />
        <path d="M2.4 12H4.2" />
        <path d="M19.8 12H21.6" />
        <path d="M5.22 5.22L6.49 6.49" />
        <path d="M17.51 17.51L18.78 18.78" />
        <path d="M5.22 18.78L6.49 17.51" />
        <path d="M17.51 6.49L18.78 5.22" />
    </svg>
);

const DarkIcon = ({ className }: { className?: string }) => (
    <svg className={className} {...iconProps}>
        <path d="M20.4 13.32A8.64 8.64 0 1 1 10.68 3.6A6.72 6.72 0 0 0 20.4 13.32Z" />
    </svg>
);

const THEME_OPTIONS: { value: Theme; label: string; Icon: typeof SystemIcon }[] = [
    { value: 'system', label: 'Auto', Icon: SystemIcon },
    { value: 'light', label: 'Light', Icon: LightIcon },
    { value: 'dark', label: 'Dark', Icon: DarkIcon },
];

const ThemeToggle = ({ isMobile }: { isMobile?: boolean }) => {
    const { theme, setTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // the persisted choice only arrives after hydration, so nothing is marked
    // selected until then — otherwise the server and client markup disagree
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            className={`${styles.themeSegmented} ${isMobile ? styles.themeSegmentedMobile : ''}`}
            role="radiogroup"
            aria-label="Colour theme"
        >
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
                const isSelected = mounted && theme === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={label}
                        title={label}
                        className={`${styles.themeSegment} ${isSelected ? styles.themeSegmentActive : ''}`}
                        onClick={() => setTheme(value)}
                    >
                        <Icon className={styles.themeSegmentIcon} />
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;
