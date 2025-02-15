function calculateItemsPerPage():number {
    
    const containerWidth = 300;
    const viewportWidth = window.innerWidth;
    const gap = 16; 
    const calculatedItemsPerRow = Math.floor((viewportWidth) / (containerWidth + gap));
    console.log("items per row " +calculatedItemsPerRow)
    const rows=6
    if(calculatedItemsPerRow<=1){
        return 20
    }
    return calculatedItemsPerRow*rows; 
}

export default calculateItemsPerPage;