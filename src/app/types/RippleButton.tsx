import React, { ButtonHTMLAttributes } from "react";
import styles from "./CustomButton.module.css";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  suggestion?: string;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className,
  suggestion,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;

    // Remove existing ripple if present
    const existingRipple = button.querySelector(`.${styles.ripple}`);
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create a new ripple element
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    // Remove the ripple after animation
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });

    // Trigger onClick if provided
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <div className={styles.rippleButtonContainer}>
      <button
        className={`${styles.rippleButton} ${className || ""}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
      {suggestion && <div className={styles.suggestion}>{suggestion}</div>}
    </div>
  );
};

export default RippleButton;
