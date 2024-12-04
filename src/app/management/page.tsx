import React from "react";
import PerformersCard from "./components/Performers";
import CategoriesCard from "./components/Categories";
import UploadCard from "./components/UploadCard";
const management=()=>{

    return (<div>
        <UploadCard/>
        <PerformersCard/>
        <CategoriesCard/>
    </div>)

}

export default management;