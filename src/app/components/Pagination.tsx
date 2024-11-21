
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../types/FileDataList';

export default function Pagination({page,limit,total}:Meta){

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Check if we are on the first or last page
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    return(
        <div className={styles.button_container}>
            <Link href={isFirstPage?'#':`/files?page=${page-1}`} className={`${styles.button} ${isFirstPage?styles.disabled:undefined}`}>
                <img src="/svg/left.svg"></img>
            </Link>
            <select
                className={styles.dropdown_select}
                value={page}
                onChange={(e) => window.location.href = `/files?page=${e.target.value}`}
            >
                {pageOptions.map(option => (
                    <option key={option} value={option}>
                        Page {option}
                    </option>
                ))}
            </select>
            <Link href={isLastPage?'#':`/files?page=${page+1}`}  className={`${styles.button} ${isLastPage?styles.disabled:undefined}`}>
                <img src="/svg/right.svg"></img>
            </Link>
        </div>
    )
}