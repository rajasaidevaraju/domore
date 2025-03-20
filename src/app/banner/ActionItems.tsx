'use client'

import styles from './Banner.module.css'
import { useState, useEffect } from 'react';
import PressableLink from "@/app/types/PressableLink";
import RippleButton from "@/app/types/RippleButton";
import ChangePanel from './ChangePanel'
import { useRouter } from 'next/navigation';
import { ServerRequest } from '../service/ServerRequest';
interface ActionItemsProps{
    isMobile:Boolean
    closeMenu?:()=>void
}

function ActionItems({isMobile,closeMenu}:ActionItemsProps){
    const [showChangePanel, setChangePanel] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    };
    useEffect(() => {

        checkLoginStatus();
        const storageListener = () => checkLoginStatus();
        window.addEventListener('storage', storageListener);

        return () => window.removeEventListener('storage', storageListener);
    }, []);

    const handleLogout = async () => {
        let token = localStorage.getItem('token');
        if (!!token) {
            try {
                await ServerRequest.logoutUser(token);
                
            } catch (error) {
                console.log('Logout failed:', error);
            }
            finally{
                closeMenu?.();
                localStorage.removeItem('token');
                checkLoginStatus()
                router.push('/');
            }
           
        }
        
    };


    const openPanel = () => {
        setChangePanel(true);
        setIsAnimating(true);
    };
    
    const closePanel = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setChangePanel(false);
            closeMenu?.();
        }, 300);
    };


    let style=`${styles['actionItems']} ${isMobile? styles['actionItemsMenu']:""}`
    let buttonStyle=`${styles['actionItem']} ${isMobile? styles['actionItemMobile']:""}`
    return(
        <>
            <div className={style}>
                <PressableLink href="/filter" className={buttonStyle} onClick={closeMenu}>
                    <img src="/svg/filter.svg" alt="Filter" className={styles.icon} />
                    <span className={styles.iconText}>Filter</span>
                </PressableLink>
                <PressableLink href="/management" className={buttonStyle} onClick={closeMenu}>
                    <img src="/svg/management.svg" alt="Management" className={styles.icon} />
                    <span className={styles.iconText}>Management</span>
                </PressableLink>
                {isLoggedIn ? (
                    <RippleButton className={buttonStyle} onClick={handleLogout}>
                        <img src="/svg/logout.svg" alt="Logout" className={styles.icon} />
                        <span className={styles.iconText}>Logout</span>
                    </RippleButton>
                ) : (
                    <PressableLink href="/login" className={buttonStyle} onClick={closeMenu}>
                        <img src="/svg/login.svg" alt="Login" className={styles.icon} />
                        <span className={styles.iconText}>Login</span>
                    </PressableLink>
                )}
                <RippleButton className={buttonStyle} onClick={openPanel}>
                <img src="/svg/switch.svg" alt="Change Server" className={styles.icon} />
                <span className={styles.iconText}>Change Server</span>
                </RippleButton>
            </div>
            {showChangePanel && (
                <div>
                  <div className={`${styles.overlay} ${isAnimating ? styles.enter : styles.exit}`}></div>
                  <div
                    className={`${styles.changePanel} ${isAnimating ? styles.enter : styles.exit}`}
                    onAnimationEnd={() => !showChangePanel && setIsAnimating(false)}
                  >
                    <ChangePanel onClose={closePanel}></ChangePanel>
                  </div>
                </div>
                )}
        </>
    )
}

export default ActionItems