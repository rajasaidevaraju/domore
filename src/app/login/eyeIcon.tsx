import React from 'react';
import styles from './Login.module.css'


interface EyeIconProps {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}

const EyeIcon: React.FC<EyeIconProps> = ({ showPassword, setShowPassword }) => {
  return (
    <div className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="rgb(var(--foreground-rgb))" />
                {showPassword && (<path d="M3 3L21 21" stroke="rgb(var(--foreground-rgb))" strokeWidth="2" /> )}
        </svg>
    </div>
 
  );
};




export default EyeIcon;