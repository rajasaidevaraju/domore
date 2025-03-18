import React, { ButtonHTMLAttributes, useRef, useEffect } from "react";
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const suggestionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (suggestionRef.current && buttonRef.current) {
      const buttonEl = buttonRef.current;
      const suggestionEl = suggestionRef.current;
      const buttonRect = buttonEl.getBoundingClientRect();
      const suggestionWidth = suggestionEl.offsetWidth;


      // Horizontal positioning: Center the suggestion, but clamp within viewport
      const idealLeft = (buttonRect.width - suggestionWidth) / 2; // Center relative to button
      const minLeft = -buttonRect.left; // Ensure left edge >= 0 on screen
      const maxLeft = window.innerWidth - suggestionWidth - buttonRect.left; // Ensure right edge <= window.innerWidth
      const clampedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));
      suggestionEl.style.left = `${clampedLeft}px`;

      // Vertical positioning: Start below, flip to above if needed
      suggestionEl.style.top = "0";
      suggestionEl.style.bottom = "auto";
      suggestionEl.style.transform = "translateY(100%)";
      suggestionEl.style.marginBottom = "0";

      // Check if it goes off the bottom after positioning
      const rect = suggestionEl.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        suggestionEl.style.top = "auto";
        suggestionEl.style.bottom = "100%"; // Bottom of suggestion at top of button
        suggestionEl.style.transform = "none";
        suggestionEl.style.marginTop = "0";
        suggestionEl.style.marginBottom = "5px"; // Space above button
      }
    }
  }, [suggestion]);

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
        ref={buttonRef}
        className={`${styles.rippleButton} ${className || ""}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
      {suggestion && (
        <div ref={suggestionRef} className={styles.suggestion}>
          {suggestion}
        </div>
      )}
    </div>
  );
};

export default RippleButton;