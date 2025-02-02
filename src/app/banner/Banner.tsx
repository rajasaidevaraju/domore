'use client'

import React, { useState, useEffect } from "react";
import styles from './Banner.module.css';
import ActionItems from './ActionItems'
import RippleButton from "@/app/types/RippleButton";
import RippleButtonLink from "@/app/types/RippleButtonLink";
import PressableLink from "../types/PressableLink";

const Banner = () => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
        checkScreenSize();

        window.addEventListener(resizeEvent,checkScreenSize)
        return()=>{
            window.removeEventListener(resizeEvent,checkScreenSize)
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
            <div className={styles.dropdown}>
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

