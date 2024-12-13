import React from "react";
import PerformersCard from "./components/Performers";
import CategoriesCard from "./components/Categories";
import UploadCard from "./components/UploadCard";
import Stats from "./components/Stats";
const management=()=>{

    return (<div>
        <UploadCard/>
        <PerformersCard/>
        <CategoriesCard/>
        <Stats/>
    </div>)

}

export default management;