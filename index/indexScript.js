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
// window.onload = showCarouselFn(count);
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
    if(x >= 3030) x=0;
    x+=oneCatWidth;
    featuredCat.scrollLeft=x;
}
let prevSlick = document.getElementById('slick-prev');
let catCarouselLeft=()=>{
    x-=oneCatWidth;
    if(x<=0) x=3030;
    featuredCat.scrollLeft= x;
}
setInterval(() => {
    activateCatCarousel();
}, 5000)
// category carousel end

// popular products 
// fetch products
async function fetchAllProducts(){
let response = await fetch('https://dummyjson.com/products?limit=0')
let products = await response.json();
popularProductsLoad(products);
}
// sort and display top 10 products
let popularProducts = document.getElementById('popular-products');
let popularProductsLoad = (products)=>{
    let popularDiv,popularImgDiv, popularImg, popularText, popularCatP,popularCat,popularProdH2,popularProd,popularProduct;
    let sortedProducts = sortProductsByRating(products).slice(0,10);   
    sortedProducts.forEach((product)=>{
        popularDiv = document.createElement('div');
        popularDiv.className = 'each-popular-product';
        popularDiv.onclick = function(){
            openProduct(product.id);
        }
        popularImgDiv = document.createElement('div');
        popularImgDiv.className = 'prod-img-div';
        popularImg = document.createElement('img');
        popularImg.src = product.thumbnail;
        popularImgDiv.append(popularImg);
        popularDiv.append(popularImgDiv);
        
        // Popular texts 
        popularText = document.createElement('div');
        popularText.className = 'prod-text-div';

        popularCatP = document.createElement('p');
        let slicedTitle = product.category.charAt(0).toUpperCase()+ product.category.slice(1);
        popularCat = document.createTextNode(slicedTitle.replace(/-/g, ' '));
        popularCatP.append(popularCat);
        popularText.append(popularCatP);

        popularProdH2 = document.createElement('h2');
        popularProd = document.createTextNode(product.title.charAt(0).toUpperCase()+ product.title.slice(1));
        popularProdH2.append(popularProd);
        popularText.append(popularProdH2);
        popularText.append(ratingFunction(product.rating));
        let priceAddDiv = document.createElement('div');
            priceAddDiv.className = "price-add-div"

        let priceSpan = document.createElement('span');
            priceSpan.className = "popular-price-span price-span"
        priceSpan.append(document.createTextNode('$'+product.price));
        priceAddDiv.append(priceSpan);

        buttonSpan = document.createElement('span');
        buttonSpan.className = 'popular-btn-span'
        addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'site-button add-to-cart-btn popular-btn';
        // let addIcon = document.createElement('i');
        //     addIcon.classList.add('fa-solid', 'fa-plus');
        //     addIcon.style.color = '#ffffff'
        addToCartBtn.innerHTML ='<i class="fa-solid fa-plus" style="color: #ffffff;"></i> Add' ;
        buttonSpan.append(addToCartBtn);
        priceAddDiv.append(buttonSpan);
        popularText.append(priceAddDiv)
        popularDiv.append(popularText);
        //append the item div to html
        popularProducts.append(popularDiv);
    })
}

function sortProductsByRating(products) {
  return products.products.sort(function(a, b) {
    return b.rating - a.rating;
  });
}
// create rating stars 
let ratingFunction = (rating)=>{
    let ratingDiv = document.createElement('div');
    ratingDiv.className ='rating-div'
    let ratingRounded = Math.round(rating/0.5) * 0.5;
    let ratingInt = Math.trunc(ratingRounded);
    let ratingDecimal = ratingRounded.toString().split(".")[1];
    for(let i =0; i<ratingInt;i++){
     ratingDiv.append(ratingStarFull());
    }
    if(ratingDecimal == 5) ratingDiv.append(ratingStarHalf());
    ratingDiv.append(document.createTextNode(' '+rating));
  return ratingDiv;
}
let ratingStarFull=()=>{
    let ratingIcon = document.createElement('i');
        ratingIcon.classList.add('fas', 'fa-star');
        ratingIcon.style.color = '#ffff00';
    return ratingIcon;
}
let ratingStarHalf = ()=>{
    let ratingIcon = document.createElement('i');
        ratingIcon.classList.add('fa','fa-duotone', 'fa-star-half');
        ratingIcon.style.color = '#ffff00';
    return ratingIcon;
}

// product card opened
