'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Pagination.module.css';
import { Meta } from '../../types/FileDataList';

interface PaginationProps{
    meta:Meta,
    performerId:number|null
    sortBy:string|undefined
}

export default function Pagination({meta:{page, limit, total}, performerId,sortBy}:PaginationProps){

    const router = useRouter();
    const totalPages = Math.ceil(total / limit);

    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    let base=new URL("/files",window.location.origin)

    if(performerId!=null){
        base.searchParams.append("performerId",performerId.toString())
    }

    if(sortBy){
        base.searchParams.append("sortBy",sortBy)
    }


    let prevUrl=isFirstPage?new URL("#",window.location.origin):new URL(base);

    if(!isFirstPage){
        prevUrl.searchParams.append("page", (page-1).toString());
    }

    let nextUrl=isLastPage?new URL("#",window.location.origin):new URL(base);
    if(!isLastPage){
        nextUrl.searchParams.append("page", (page+1).toString());
    }

    const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPage = e.target.value;
        let url = new URL("/files",window.location.origin);
        url.searchParams.append("page", selectedPage);
        if(performerId){
            url.searchParams.append("performerId",performerId.toString())
        }
        if(sortBy){
            url.searchParams.append("sortBy",sortBy)
        }
        router.push(url.pathname + url.search);
    };


    return(
        <div className={styles.button_container}>
            <Link href={prevUrl.toString()} className={`${styles.button} ${isFirstPage?styles.disabled:undefined}`}>
                <img src="/svg/left.svg" alt="left button"></img>
            </Link>
            <select
                className={styles.pageSelect}
                value={page}
                onChange={handlePageChange}
            >
                <option value="" disabled>Select Page</option>
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