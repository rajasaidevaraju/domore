'use client'

import React, { useState, useEffect,useRef } from "react";
import styles from './Banner.module.css';
import ActionItems from './ActionItems'
import RippleButton from "@/app/types/RippleButton";
import RippleButtonLink from "@/app/types/RippleButtonLink";
import PressableLink from "../types/PressableLink";

const Banner = () => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const resizeEvent="resize"

    
    useEffect(()=>{
        const checkScreenSize=()=>{
            if(window.innerWidth<=768){
                setIsMobile(true)
            }else{
                setIsMobile(false)
                setMenuOpen(false)
            }
        }
        const handleClickOutside = (event:MouseEvent) => {
            
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setMenuOpen(false);
            }
        };
        checkScreenSize();
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener(resizeEvent,checkScreenSize)
        return()=>{
            window.removeEventListener(resizeEvent,checkScreenSize)
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[])

    function toggleActionItems(){
       
            setMenuOpen((prev) => !prev);
       
       
    }

    return (
      <div className={styles.banner}>
        <PressableLink href="/" className={styles.actionItem}>
            <img src="/svg/home.svg" alt="Filter" className={styles.icon} />
            <span className={styles.icon_text}>Home</span>
        </PressableLink>
        {isMobile!=null && !isMobile && <ActionItems isMobile={isMobile}/>}
        
        {isMobile!=null && isMobile &&
            <div className={styles.dropdown} ref={dropdownRef}>
                <RippleButton className={styles.actionItem} onClick={toggleActionItems}>
                    <img src="/svg/menu.svg" alt="Menu" className={styles.icon} />
                    <span className={styles.iconText}>Menu</span>
                </RippleButton>
                {isMobile && menuOpen && 
                    <div className={styles.dropdownContent}>
                        <ActionItems isMobile={isMobile} />
                    </div>
                }
            </div>
        }
    </div>
  );
};

export default Banner;

