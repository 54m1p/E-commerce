 window.onload = openProductCard();
 let prodImg, otherImgs, mainImgDiv,smallImgDiv;
 async function openProductCard (){
    let urlString = new URLSearchParams(window.location.search);
    let prodId = urlString.get('key');
    let response = await fetch('https://dummyjson.com/products/'+prodId);
    const isalready = wishListArr.some(item=> item.prodid ==prodId);
    if(isalready){
        console.log('already in list');
        document.getElementById('add-to-wishlist').innerHTML = '<i class="fa-solid fa-heart fa-lg"></i>';
    }
    let fetchedProd = await response.json();
    // prodImg = document.getElementById('prod-img');
    // prodImg.src = fetchedProd.thumbnail;
    mainImgDiv = document.querySelector('.main-img-div');
    smallImgDiv = document.getElementById('small-images');
    for(let i=0;i<fetchedProd.images.length;i++){
        let prodImgs = document.createElement('img');
        prodImgs.src = fetchedProd.images[i];
        prodImgs.className = 'main-img';
    
        mainImgDiv.appendChild(prodImgs);
        let smallImg = document.createElement('img');
        smallImg.src= fetchedProd.images[i];
        smallImg.onclick= function(){
            console.log('inside the click small img function')
            mainImgDiv.scrollLeft = i * mainImgDiv.clientWidth;
        }
        smallImgDiv.appendChild(smallImg);
    }
    let prodCat = document.querySelector('.product-category');
    prodCat.href = 'category.html?cat='+fetchedProd.category;
    let slicedTitle = fetchedProd.category.charAt(0).toUpperCase()+fetchedProd.category.slice(1)
    prodCat.innerHTML= slicedTitle.replace(/-/g,'');

    let prodTit = document.querySelector('.product-title');
    prodTit.innerHTML= fetchedProd.title;
    let prodRating = document.querySelector('.product-rating');
    prodRating.append(ratingFunction(fetchedProd.rating));
    // prodRating.append(document.createTextNode('  '+'('+fetchedProd.rating+')'));

    let productPrice = document.querySelector('.product-price');
    let prodPriceOriginal = document.createElement('span');
        prodPriceOriginal.className= 'product-price child-1'
        prodPriceOriginal.append(document.createTextNode('$'+fetchedProd.price));
    if(fetchedProd.discountPercentage>0){
        prodPriceOriginal.style.textDecoration ='line-through';
        productPrice.append(prodPriceOriginal);
        let offerPriceSpan = document.createElement('span');
            offerPriceSpan.className= 'product-price child-2';
        let prodPriceDiscounted = document.createElement('strong');
        prodPriceDiscounted.append(document.createTextNode(' $'+(fetchedProd.price - (fetchedProd.discountPercentage*fetchedProd.price/100)).toFixed(2)));
        offerPriceSpan.append(prodPriceDiscounted)
        productPrice.append(offerPriceSpan);
        let discountSpan = document.createElement('span');
            discountSpan.className = 'discount-span'
        let boldPrice = document.createElement('strong');
        boldPrice.appendChild(document.createTextNode(' '+ fetchedProd.discountPercentage+'% off'));
        discountSpan.appendChild(boldPrice)
        productPrice.append(discountSpan);
    }
    let prodInfo = document.querySelector('.product-info');
    prodInfo.appendChild(document.createTextNode(fetchedProd.description));

    let toBuyQty = document.querySelector('#qty-box');
    let decreaseQty = document.querySelector('.decrease-qty');
        decreaseQty.onclick = function(){
            incDecBtnClick(1);
        }
            // toBuyQty.value ==0 ? toBuyQty.value : toBuyQty.value = parseInt(toBuyQty.value)- 1;
    let increaseQty = document.querySelector('.increase-qty');
        increaseQty.onclick =function(){
            incDecBtnClick(2);
        }
            // document.getElementById('qty-box').value =  parseInt(toBuyQty.value) + 1;            
    let prodBrand = document.querySelector('.prod-brand');
    prodBrand.appendChild(document.createTextNode(fetchedProd.brand));

    let prodStock = document.querySelector('.prod-stock');
    fetchedProd.stock == 0?  prodStock.appendChild(document.createTextNode(Not in Stock)) : prodStock.appendChild(document.createTextNode( fetchedProd.stock+' items in stock.')); 

    let prodShip = document.querySelector('.prod-ship');
    fetchedProd.price > 200? prodShip.appendChild(document.createTextNode('Free Shipping')) : prodShip.appendChild(document.createTextNode('Shipping charges applied'));
    openRelatedItems(fetchedProd.category);
}
let incDecBtnClick = (clicked)=>{
    let toBuyQty = document.getElementById('qty-box');
    switch(clicked){
        case 1:
            if(toBuyQty.value == 0){
                toBuyQty.value = 0;       
            }else{
                toBuyQty.value = parseInt(toBuyQty.value)-1;          
            }
            console.log('dec clicked')
            break;
        case 2:
            toBuyQty.value = parseInt(toBuyQty.value) +1;         
            console.log('inc clicked')      
            break;
    }
    
    if(toBuyQty.value == 0){
        console.log(toBuyQty.value,'--tobuy qty within if')
        document.getElementById('add-to-cart-btn').disabled = true;
        document.getElementById('add-to-cart-btn').style.backgroundColor = '#ff1122';
    }else{
        console.log(toBuyQty.value,'--tobuy qty within else')
        document.getElementById('add-to-cart-btn').disabled = false;
        document.getElementById('add-to-cart-btn').style.backgroundColor = '#0aad0a';        
    }
}
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
    ratingDiv.append(document.createTextNode(' '+rating.toFixed(1)));
  return ratingDiv;
}
let ratingStarFull=()=>{
    let ratingIcon = document.createElement('i');
        ratingIcon.classList.add('fas', 'fa-star');
        ratingIcon.style.color = 'rgb(255, 193, 7)';
    return ratingIcon;
}
let ratingStarHalf = ()=>{
    let ratingIcon = document.createElement('i');
        ratingIcon.classList.add('fas','fa-duotone', 'fa-star-half');
        ratingIcon.style.color = 'rgb(255, 193, 7)';
    return ratingIcon;
}

//related products section
async function fetchAllProducts(category){
    let response = await fetch('https://dummyjson.com/products/category/'+category)
    let products = await response.json();
    return products;
    }
let relatedProdDiv = document.querySelector('.related-prod-section');
async function openRelatedItems  (category){
    let relatedDiv,relatedImgDiv, relatedImg, relatedText, relatedCatP,relatedCat,relatedProdH2,relatedProd,relatedProduct,addToCartBtn;

    let showRelatedProds = await productsByCategory(category);   
    showRelatedProds.forEach((product)=>{
        relatedDiv = document.createElement('div');
        relatedDiv.className = 'each-product';
        relatedDiv.onclick = function(){
            openProduct(product.id);
        }
        relatedImgDiv = document.createElement('div');
        relatedImgDiv.className = 'prod-img-div';
        relatedImg = document.createElement('img');
        relatedImg.src = product.thumbnail;
        relatedImgDiv.append(relatedImg);
        relatedDiv.append(relatedImgDiv);
        relatedText = document.createElement('div');
        relatedText.className = 'prod-text-div';

        relatedCatP = document.createElement('p');
        let slicedTitle = product.category.charAt(0).toUpperCase()+ product.category.slice(1);
        relatedCat = document.createTextNode(slicedTitle.replace(/-/g, ' '));
        relatedCatP.append(relatedCat);
        relatedText.append(relatedCatP);

        relatedProdH2 = document.createElement('h2');
        relatedProd = document.createTextNode(product.title.charAt(0).toUpperCase()+ product.title.slice(1));
        relatedProdH2.append(relatedProd);
        relatedText.append(relatedProdH2);
        relatedText.append(ratingFunction(product.rating));
        let priceAddDiv = document.createElement('div');
            priceAddDiv.className = "price-add-div"

        let priceSpan = document.createElement('span');
            priceSpan.className = "related-price-span price-span"
        priceSpan.append(document.createTextNode('$'+product.price));
        priceAddDiv.append(priceSpan);

        buttonSpan = document.createElement('span');
        buttonSpan.className = 'related-btn-span'
        addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'site-button add-to-cart-btn related-btn';
        addToCartBtn.innerHTML ='<i class="fa-solid fa-plus" style="color: #ffffff;"></i> Add' ;
        buttonSpan.append(addToCartBtn);
        priceAddDiv.append(buttonSpan);
        relatedText.append(priceAddDiv)
        relatedDiv.append(relatedText);
        //append the item div to html
        relatedProdDiv.append(relatedDiv);
        })
}

async function productsByCategory(category){
    let relatedArr =[]
    let allProds = await fetchAllProducts(category);
    allProds.products.forEach(product=>{
        relatedArr.push(product)
    })
   return relatedArr.sort(() => Math.random() - Math.random()).slice(0, 5);
}

// product card opened
async function fetchProduct(prodId){
    let response = await fetch('https://dummyjson.com/products/'+prodId)
    let product = await response.json(); 
    openProduct(product);  
}

 function openProduct(id){
    location.href = "../product/product.html?key="+id;
}

// for fetching all products
async function allproductsFetch(){
    let response = await fetch('https://dummyjson.com/products?skip=0&limit=100');
    return response.json();
}

//header wishlist button clicked
let wishlistBtn = document.querySelector('.wishlist-span');
wishlistBtn.addEventListener('click',()=> openWishList());
async function openWishList(){
    document.getElementById('wish-list-modal').style.display = 'block'
    let wishListContents = document.getElementById('wish-list-contents');
    let allProd = await allproductsFetch();
    let wishListArr = localStorage.getItem('wish-list')!=null? JSON.parse(localStorage.getItem('wish-list')):[];
    let wishListProd=[];
    wishListArr.forEach((item)=>{
        for(let i= 0; i<allProd.products.length;i++){
            if(allProd.products[i].id == item.prodid) wishListProd.push(allProd.products[i]);
        }
    })
    showWishProd(wishListProd);
}

// show wishlist products as html
async function showWishProd(products){
    // console.log('into the show wish prod', products)
    let wishListDiv,eachWish,eachWishImg,eachWishTitle,eachWishPrice,addToCartBtn,removeWishBtn;
    let wishListSection = document.getElementById('wish-list-contents');
    wishListSection.innerHTML = "" ;
    products.forEach((product)=>{
        console.log(product.thumbnail,'--product thumbnail')
        eachWish = document.createElement('div');
            eachWish.className='each-wish-div';
        eachWishImg = document.createElement('img');
            eachWishImg.src= product.thumbnail;
        eachWishTitle = document.createElement('h3');
            eachWishTitle.appendChild(document.createTextNode(product.title));
            let discPrice = product.price-(product.discountPercentage/100)*product.price;
            eachWishPrice=document.createTextNode('$'+discPrice.toFixed(2));
        addToCartBtn = document.createElement('button');
            addToCartBtn.className='site-button add-to-cart-btn';
            addToCartBtn.onclick = function(){
                alert('Product added to cart');
                addToCartFn();
            }
            addToCartBtn.innerHTML ='Add To Cart' ;
        removeWishBtn = document.createElement('button');
            removeWishBtn.innerHTML = '<i class="fa fa-duotone fa-trash-can"></i>';
            removeWishBtn.onclick = function(){
                console.log('rmeove button pressed in wishlist')
                wishListArr = wishListArr.filter(item => item.prodid !=product.id);
                localStorage.setItem('wish-list',JSON.stringify(wishListArr));
                this.parentNode.style.display = 'none';
            }
        
        eachWish.appendChild(eachWishImg);
        eachWish.appendChild(eachWishTitle);
        eachWish.appendChild(eachWishPrice);
        eachWish.appendChild(addToCartBtn);
        eachWish.appendChild(removeWishBtn);

        wishListSection.appendChild(eachWish);
    })
    console.log(products,'---products in wishlist');
}
let wishlistClose =document.querySelector('.wishlist-modal-close');
wishlistClose.addEventListener('click',function(){
    document.getElementById('wish-list-modal').style.display = 'none'
    location.reload();
});

//when user clicks product wishlist button
var wishListArr = localStorage.getItem('wish-list')!= null ? JSON.parse(localStorage.getItem('wish-list')) : [];
let addToWishlist = document.getElementById('add-to-wishlist');
addToWishlist.addEventListener('click', ()=> addtoWish());
 function addtoWish(){
    let urlString = new URLSearchParams(window.location.search);
    let prodId = urlString.get('key');
    const isalready = wishListArr.some(item=> item.prodid ==prodId);
    if(!isalready){
        wishListArr.push({
            prodid: prodId
        });
        document.getElementById('add-to-wishlist').innerHTML = '<i class="fa-solid fa-heart fa-lg"></i>';
    }else{
        wishListArr = wishListArr.filter(item => item.prodid !=prodId);
        document.getElementById('add-to-wishlist').innerHTML = '<i class="fa-regular fa-heart fa-lg"></i>';
    }
    console.log('wishListArr---',wishListArr);
    localStorage.setItem('wish-list',JSON.stringify(wishListArr));
    
    }

// when add to cart clicked
var cartArr = localStorage.getItem('cart-list')!= null? JSON.parse(localStorage.getItem('cart-list')):[];
    let addCartBtn = document.querySelector('.add-to-cart-btn');
    addCartBtn.addEventListener('click', ()=> addToCartFn());
    function addToCartFn(){
        console.log('add to cart pressed');
        let itemQty = document.getElementById('qty-box').value;
        let urlString = new URLSearchParams(window.location.search);
        let prodId = urlString.get('key');
        const isalready = cartArr.some(item=> item.prodid == prodId);
        if(!isalready){
            alert('Item added to cart')
            cartArr.push({
                prodid: prodId,
                prodqty: itemQty
            });
        }else{
            alert('Item already in cart')
        }
        localStorage.setItem('cart-list',JSON.stringify(cartArr));
    }
// header cart opened
    let headerCartBtn = document.querySelector('.cart-span');
    headerCartBtn.addEventListener('click', ()=> openCart());
    function openCart(){
        }
    