'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../../types/FileDataList';
import { useState, useEffect, useRef } from 'react';

interface PaginationProps {
    meta: Meta,
    performerId: number | null
    sortBy: string | undefined
}

export default function Pagination({ meta: { page, limit, total }, performerId, sortBy }: PaginationProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const totalPages = Math.ceil(total / limit);
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    const [prevUrl, setPrevUrl] = useState<string>("/");
    const [nextUrl, setNextUrl] = useState<string>("/");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let base = new URL("/files", window.location.origin);
            if (performerId != null) {
                base.searchParams.append("performerId", performerId.toString())
            }
            if (sortBy) {
                base.searchParams.append("sortBy", sortBy)
            }

            let calculatedPrevUrl: URL;
            if (isFirstPage) {
                calculatedPrevUrl = new URL("#", window.location.origin);
            } else {
                calculatedPrevUrl = new URL(base);
                calculatedPrevUrl.searchParams.append("page", (page - 1).toString());
            }
            setPrevUrl(calculatedPrevUrl.toString());

            let calculatedNextUrl: URL;
            if (isLastPage) {
                calculatedNextUrl = new URL("#", window.location.origin);
            } else {
                calculatedNextUrl = new URL(base);
                calculatedNextUrl.searchParams.append("page", (page + 1).toString());
            }
            setNextUrl(calculatedNextUrl.toString());
        }
    }, [page, performerId, sortBy, isFirstPage, isLastPage]);

    const handlePageChange = (selectedPage: number) => {
        if (typeof window !== 'undefined') {
            let url = new URL("/files", window.location.origin);
            url.searchParams.append("page", selectedPage.toString());
            if (performerId) {
                url.searchParams.append("performerId", performerId.toString())
            }
            if (sortBy) {
                url.searchParams.append("sortBy", sortBy)
            }
            router.push(url.pathname + url.search);
            setIsOpen(false);
        }
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