var count = 1;
// for index-banner carousel
let showCarouselFn=(count)=>{
    let indexCarousel = document.querySelectorAll(".index-carousel-img");
    indexCarousel.forEach(image =>{
        image.style.display = 'none';
        let classSplit = image.className.split('-');
        if(count == classSplit[3]) image.style.display ='block';
        })
}
function activateTimer(){
    if(count>document.querySelectorAll(".index-carousel-img").length){
        count = 1;
    }
    showCarouselFn(count);
    count++;
}
setInterval(() => {
       activateTimer();
}, 3000)

//categories carousel
async function featuredCatFetch(){
    let response = await fetch('https://dummyjson.com/products/categories');
    let categories = await response.json();
    addCategory(categories)
}
let totalCatWidth, oneCatWidth;
let featuredCat = document.querySelector('.featured-category');
let featuredCatDiv, featuredCatImg, featuredCatTitleDiv,featuredCatTitle;
let addCategory=(categories)=>{
        categories.forEach((category)=>{
             featuredCatDiv = document.createElement('div');
             featuredCatDiv.className = 'each-category';
             featuredCatImg =document.createElement('img');
                featuredCatImg.src = "https://cdn.pixabay.com/photo/2017/01/08/08/00/bubbles-1962355_1280.png";
                featuredCatImg.className = "featured-cat-img";
            featuredCatDiv.append(featuredCatImg);
             featuredCatTitleDiv = document.createElement('p');
                featuredCatTitleDiv.className = 'featured-cat-title'
             let slicedTitle = category.charAt(0).toUpperCase()+ category.slice(1);
             featuredCatTitle = document.createTextNode(slicedTitle.replace(/-/g, ' '));
             featuredCatTitleDiv.append(featuredCatTitle);
             featuredCatDiv.append(featuredCatTitleDiv);   
             featuredCat.append(featuredCatDiv);
        })
        totalCatWidth = featuredCat.scrollWidth;
        oneCatWidth = featuredCatDiv.offsetWidth;
}
let index =0;
let minWidth =0;
let maxWidth = oneCatWidth;
let x =0;
let activateCatCarousel=()=>{
    console.log(x,'--x', totalCatWidth,'--total cat width')
    if(x >= 3030) x=0;
    x+=oneCatWidth;
    featuredCat.scrollLeft=x;
}
let prevSlick = document.getElementById('slick-prev');
let catCarouselLeft=()=>{
    x-=oneCatWidth;
    console.log('x value left--',x)
    if(x<=0) x=3030;
    featuredCat.scrollLeft= x;
}
setInterval(() => {
    activateCatCarousel();
}, 5000)
// category carousel end

// popular products 
async function fetchAllProducts(){
let response = await fetch('https://dummyjson.com/products?limit=0')
let products = await response.json();
popularProductsLoad(products);
}
let popularProducts = document.getElementById('popular-products')
let popularProductsLoad = (products)=>{
    // products.forEach((product)=>{
    //     console.log(product,'---products')
    // })
    console.log(products,'---products');
}
