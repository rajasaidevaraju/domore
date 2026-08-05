'use client'

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../../types/FileDataList';
import { useState, useEffect, useRef } from 'react';
import { FileFilters, filesUrl } from '../filterParams';

interface PaginationProps {
    meta: Meta
    filters: FileFilters
}

export default function Pagination({ meta: { page, limit, total }, filters }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const totalPages = Math.ceil(total / limit);
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    const pageUrl = (target: number) => filesUrl(pathname, { ...filters, page: target });
    const prevUrl = isFirstPage ? "#" : pageUrl(page - 1);
    const nextUrl = isLastPage ? "#" : pageUrl(page + 1);

    const handlePageChange = (selectedPage: number) => {
        router.push(pageUrl(selectedPage));
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.button_container}>
            <Link href={prevUrl} className={`${styles.button} ${isFirstPage ? styles.disabled : ""}`}>
                <img src="/svg/left.svg" alt="left button" />
            </Link>

            <div className={styles.customDropdown} ref={dropdownRef}>
                <div
                    className={`${styles.dropdownTrigger} ${isOpen ? styles.active : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>Page {page}</span>
                    <img
                        src="/svg/right.svg"
                        className={styles.dropdownIcon}
                        alt=""
                        style={{ transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
                    />
                </div>

                {isOpen && (
                    <div className={styles.dropdownMenu}>
                        {pageOptions.map((p) => (
                            <div
                                key={p}
                                className={`${styles.dropdownItem} ${page === p ? styles.selected : ""}`}
                                onClick={() => handlePageChange(p)}
                            >
                                Page {p}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Link href={nextUrl} className={`${styles.button} ${isLastPage ? styles.disabled : ""}`}>
                <img src="/svg/right.svg" alt="right button" />
            </Link>
        </div>
    )
}
