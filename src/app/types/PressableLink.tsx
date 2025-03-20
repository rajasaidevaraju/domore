import { useState } from 'react';
import Link from 'next/link';
import styles from './CustomButton.module.css';

interface PressableLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?:()=>void
}

const PressableLink = ({ href, children, onClick, className = ''}: PressableLinkProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => setIsPressed(true);
    const handleRelease = () => setIsPressed(false);

    return (
        <Link
            onClick={()=>onClick?.()}
            href={href}
            className={`${styles.pressable} ${isPressed ? styles.pressed : ''} ${className}`}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            onTouchCancel={handleRelease}
        >
            {children}
        </Link>
    );
};

export default PressableLink;