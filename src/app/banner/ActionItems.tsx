'use client'

import styles from './Banner.module.css'
import { useState } from 'react';
import PressableLink from "@/app/types/PressableLink";
import RippleButton from "@/app/types/RippleButton";
import ChangePanel from './ChangePanel'
import { usePathname, useRouter } from 'next/navigation';
import { UserRequests } from '../service/UserRequests';
import { useAuthStore } from '@/app/store/auth';
interface ActionItemsProps {
    isMobile: Boolean
    closeMenu?: () => void
}

function ActionItems({ isMobile, closeMenu }: ActionItemsProps) {
    const [showChangePanel, setChangePanel] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { isLoggedIn, token, clearAuth } = useAuthStore();
    const pathname = usePathname();

    const isManagementActive = pathname === '/management';
    const isFilterActive = pathname === '/filter';
    const isLoginActive = pathname === '/login';


    const router = useRouter();


    const handleLogout = async () => {
        if (!!token) {
            try {
                await UserRequests.logoutUser(token);
            } catch (error) {
                console.log('Logout failed:', error);
            }
            finally {
                closeMenu?.();
                clearAuth();
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



    let style = `${styles['actionItems']} ${isMobile ? styles['actionItemsMenu'] : ""}`
    let buttonStyle = `${styles['actionItem']} ${isMobile ? styles['actionItemMobile'] : ""}`

    let filterStyle = `${buttonStyle} ${!isMobile && isFilterActive ? styles['active'] : ""}`
    let managementStyle = `${buttonStyle} ${!isMobile && isManagementActive ? styles['active'] : ""}`
    let loginStyle = `${buttonStyle} ${!isMobile && isLoginActive ? styles['active'] : ""} ${isLoggedIn && styles['hidden']}`
    let logoutStyle = `${buttonStyle} ${!isLoggedIn && styles['hidden']}`

    return (
        <>
            <div className={style}>
                <PressableLink href="/filter" className={filterStyle} onClick={closeMenu}>
                    <img src="/svg/filter.svg" alt="Filter" className={styles.icon} />
                    <span className={styles.iconText}>Filter</span>
                </PressableLink>
                <PressableLink href="/management" className={managementStyle} onClick={closeMenu}>
                    <img src="/svg/management.svg" alt="Management" className={styles.icon} />
                    <span className={styles.iconText}>Management</span>
                </PressableLink>
                {isLoggedIn ? (
                    <RippleButton className={logoutStyle} onClick={handleLogout}>
                        <img src="/svg/logout.svg" alt="Logout" className={styles.icon} />
                        <span className={styles.iconText}>Logout</span>
                    </RippleButton>
                ) : (
                    <PressableLink href="/login" className={loginStyle} onClick={closeMenu}>
                        <img src="/svg/login.svg" alt="Login" className={styles.icon} />
                        <span className={styles.iconText}>Login</span>
                    </PressableLink>
                )}
                {/*<RippleButton className={buttonStyle} onClick={openPanel}>
                <img src="/svg/switch.svg" alt="Change Server" className={styles.icon} />
                <span className={styles.iconText}>Change Server</span>
                </RippleButton>*/}
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