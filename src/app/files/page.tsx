'use client'

import { useEffect, useState } from 'react'
import Home from '../page'
import { useSearchParams } from 'next/navigation'

export default function AltHome(){
    const searchParams = useSearchParams()
    let page = searchParams.get("page")
    const [numPage,setNumPage]=useState(getPageNumber(page))
    useEffect(() => {
        page = searchParams.get("page")
        
        setNumPage(getPageNumber(page))
      }, [searchParams]);
    

 return <Home page={numPage}></Home>
}

function getPageNumber(page:string | null):number{
    if(page!=null){
        if(!isNaN(Number(page))){
            return Number(page);
        }
    }
    return 1;
}