
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../types/FileDataList';

export default function Pagination({page,limit,total}:Meta){

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Check if we are on the first or last page
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;


    return(
        <div className={styles.button_container}>
            <Link href={isFirstPage?'#':`/files?page=${page-1}`}>
                <img src="/svg/left.svg"></img>
            </Link>
            <Link href={isLastPage?'#':`/files?page=${page+1}`}>
                <img src="/svg/right.svg"></img>
            </Link>
        </div>
    )
}