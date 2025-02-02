import React from "react";
import Link from "next/link";
import styles from "./CustomButton.module.css";

interface RippleButtonLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const RippleButtonLink: React.FC<RippleButtonLinkProps> = ({
  href,
  className = "",
  children,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    // Remove existing ripple if present
    const existingRipple = link.querySelector(`.${styles.ripple}`);
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create a new ripple element
    const rect = link.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = styles.ripple;
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    link.appendChild(ripple);

    // Remove the ripple after animation
    ripple.addEventListener("animationend", () => {
      ripple.remove();
      if (href) {
        window.location.href = href;
      }
    });
  };

  return (
    <Link href={href} {...props} passHref className={`${styles.rippleButton} ${className}`} onClick={handleClick}>
        {children}
    </Link>
  );
};

export default RippleButtonLink;
