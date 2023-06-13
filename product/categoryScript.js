window.onload = categoryPageLoad();

 function categoryPageLoad(){
    asideCat();
    console.log('category page load ');
    let urlString = new URLSearchParams(window.location.search);
    let urlCat = urlString.get('cat');
    console.log('urlcat in main',urlCat)
    fetchProductByCat(urlCat);
}

async function asideCat(){
    let catArr =await allCatFetch();
    console.log('catArr',catArr);
}
async function allCatFetch(){
    let response = await fetch('https://dummyjson.com/products/categories');
    let fetchedCat = await response.json();
    return fetchedCat;
}
async function fetchProductByCat(urlCat){
    console.log(urlCat,'--urlCat in fetchprod by cat')
    let response = await fetch('https://dummyjson.com/products/category/'+urlCat);
    console.log(await response.json(),'response ')
}

