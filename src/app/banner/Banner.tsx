'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from './Banner.module.css';
import ActionItems from './ActionItems'
import RippleButton from "@/app/types/RippleButton";
import RippleButtonLink from "@/app/types/RippleButtonLink";
import PressableLink from "../types/PressableLink";

const Banner = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false)
            }
        }
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        checkScreenSize();
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", checkScreenSize)
        return () => {
            window.removeEventListener("resize", checkScreenSize)
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    function toggleActionItems() {
        setMenuOpen((prev) => !prev);
    }

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <nav className={styles.banner}>
            <PressableLink href="/" className={styles.actionItem}>
                <img src="/svg/home.svg" alt="Filter" className={styles.icon} />
                <span className={styles.icon_text}>Home</span>
            </PressableLink>

            <div className={styles.desktopNav}>
                <ActionItems isMobile={false} />
            </div>

            <div className={styles.mobileNav}>
                <div className={styles.dropdown} ref={dropdownRef}>
                    <RippleButton className={styles.actionItem} onClick={toggleActionItems}>
                        <img src="/svg/menu.svg" alt="Menu" className={styles.icon} />
                        <span className={styles.iconText}>Menu</span>
                    </RippleButton>
                    {menuOpen && (
                        <div className={styles.dropdownContent}>
                            <ActionItems isMobile={true} closeMenu={closeMenu} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Banner;
