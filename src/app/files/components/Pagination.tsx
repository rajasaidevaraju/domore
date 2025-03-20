
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../../types/FileDataList';

interface PaginationProps{
    meta:Meta,
    performerId:number|null
}

export default function Pagination({meta, performerId}:PaginationProps){

    const { page, limit, total } = meta;

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Check if we are on the first or last page
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    let base=new URL("/files",window.location.origin)

    if(performerId!=null){
        base.searchParams.append("performerId",performerId.toString())
    }

    let prevUrl=isFirstPage?new URL("#"):new URL(base);

    if(!isFirstPage){
        prevUrl.searchParams.append("page", (page-1).toString());
    }

    let nextUrl=isLastPage?new URL("#"):new URL(base);
    if(!isLastPage){
        nextUrl.searchParams.append("page", (page+1).toString());
    }


    return(
        <div className={styles.button_container}>
            <Link href={prevUrl.toString()} className={`${styles.button} ${isFirstPage?styles.disabled:undefined}`}>
                <img src="/svg/left.svg" alt="left button"></img>
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
            <Link href={nextUrl.toString()}  className={`${styles.button} ${isLastPage?styles.disabled:undefined}`}>
                <img src="/svg/right.svg" alt="right button"></img>
            </Link>
        </div>
    )
}