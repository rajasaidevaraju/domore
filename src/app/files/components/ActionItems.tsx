import styles from './Banner.module.css'
import Link from 'next/link';
import RippleButtonLink from "@/app/types/RippleButtonLink";
import RippleButton from "@/app/types/RippleButton";

interface ActionItemsProps{
    isMobile:Boolean
}

function ActionItems({isMobile}:ActionItemsProps){
    let style=`${styles['actionItems']} ${isMobile? styles['actionItemsMenu']:""}`
    return(
    <div className={style}>
        <RippleButtonLink href="/filter" className={styles.actionItem}>
            <img src="/svg/filter.svg" alt="Filter" className={styles.icon} />
            <span className={styles.iconText}>Filter</span>
        </RippleButtonLink>
        <RippleButtonLink href="/management" className={styles.actionItem}>
            <img src="/svg/management.svg" alt="Management" className={styles.icon} />
            <span className={styles.iconText}>Management</span>
        </RippleButtonLink>
        <RippleButton className={styles.actionItem}>
        <img src="/svg/switch.svg" alt="Change Server" className={styles.icon} />
        <span className={styles.iconText}>Change Server</span>
        </RippleButton>
    </div>
    )
}

export default ActionItems