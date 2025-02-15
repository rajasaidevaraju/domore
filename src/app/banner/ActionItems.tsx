import styles from './Banner.module.css'
import { useState } from 'react';
import RippleButtonLink from "@/app/types/RippleButtonLink";
import PressableLink from "@/app/types/PressableLink";
import RippleButton from "@/app/types/RippleButton";
import ChangePanel from './ChangePanel'

interface ActionItemsProps{
    isMobile:Boolean
}

function ActionItems({isMobile}:ActionItemsProps){
    const [showChangePanel, setChangePanel] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    
    const openPanel = () => {
        setChangePanel(true);
        setIsAnimating(true);
    };
    
    const closePanel = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setChangePanel(false);
        }, 300);
    };


    let style=`${styles['actionItems']} ${isMobile? styles['actionItemsMenu']:""}`
    let buttonStyle=`${styles['actionItem']} ${isMobile? styles['actionItemMobile']:""}`
    return(
    <div className={style}>
        <PressableLink href="/filter" className={buttonStyle}>
            <img src="/svg/filter.svg" alt="Filter" className={styles.icon} />
            <span className={styles.iconText}>Filter</span>
        </PressableLink>
        <PressableLink href="/management" className={buttonStyle}>
            <img src="/svg/management.svg" alt="Management" className={styles.icon} />
            <span className={styles.iconText}>Management</span>
        </PressableLink>
        <RippleButton className={buttonStyle} onClick={openPanel}>
        <img src="/svg/switch.svg" alt="Change Server" className={styles.icon} />
        <span className={styles.iconText}>Change Server</span>
        </RippleButton>

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

    </div>
    )
}

export default ActionItems