window.onload = categoryPageLoad();

 function categoryPageLoad(){
    asideCat();
    let urlString = new URLSearchParams(window.location.search);
    let urlCat = urlString.get('cat');
    // fetchProductByCat(urlCat);
    categoryCardFn(urlCat);
}
var catProdArr =[]
// aside function
async function asideCat(){
    let asideLi;
    let catArr =await allCatFetch();
    let asideUl = document.querySelector('.aside-ul');
    catArr.forEach(element => {
        asideLi = document.createElement('li');
        let asideA= document.createElement('a');
        asideA.href = 'category.html?cat='+element;
        let slicedTitle = element.charAt(0).toUpperCase()+ element.slice(1);
             let catTitle = document.createTextNode(slicedTitle.replace(/-/g, ' '));
        asideA.append(catTitle);
        asideLi.append(asideA);
        asideUl.append(asideLi);
    });
}
async function asideBrandFn(catProdArr){
    let uniqueBrands = [];
        let asideBrandUl = document.getElementById('brand-ul');
        catProdArr.products.forEach(product =>{
            if (!uniqueBrands.includes(product.brand)) {
                uniqueBrands.push(product.brand);
                let asideBrandLi = document.createElement('li');
                asideBrandLi.className = 'brand-li';
                let asideBrandA = document.createElement('a');
                asideBrandA.href='category.html?cat='+product.category+'&filter='+true+'&brand='+product.brand;
                asideBrandA.onclick = function(){
                    showByBrand(product.brand);
                }
            asideBrandA.append(document.createTextNode(product.brand));
            asideBrandLi.append(asideBrandA);
            asideBrandUl.append(asideBrandLi);
              }
        })
}
//show by brand funciton
    function showByBrand(brand){
        let urlString = new URLSearchParams(window.location.search);
        let urlCat = urlString.get('cat');
        urlBrand = urlString.get('brand');
    }

let filterClick = document.getElementById('filter-click');
    filterClick.addEventListener('click',function(){
        let urlStr = new URLSearchParams(window.location.search);
        let urlCat = urlStr.get('cat');
        urlBrand = urlStr.get('brand');
        if(urlBrand == null) urlBrand = "";
        let ratingCheck = document.querySelectorAll('input[name="rating"]:checked');
        let minPrice = document.getElementById('min-price').value;
        let maxPrice = document.getElementById('max-price').value;
        let urlString = window.location.href;
        let output = "";
        ratingCheck.forEach((checked)=>{
            output+=checked.id.slice(-1);
            console.log(output,'---checked rating value');
        })
        // console.log('url string--',window)
        console.log(urlString,'--urlstrign');
        location.href = 'category.html?cat='+urlCat+'&filter='+true+'&brand='+urlBrand+'&minPrice='+minPrice+'&maxPrice='+maxPrice+"&rating="+output;
        
    })
    

// for category card
 async function categoryCardFn(urlCat){
    let catCardTitle = document.querySelector('.cat-card-title');
    let slicedTitle = urlCat.charAt(0).toUpperCase()+ urlCat.slice(1);
             let catTitle = document.createTextNode(slicedTitle.replace(/-/g, ' '));
    let catCardTitleH1 = document.createElement('h1');
    catCardTitleH1.appendChild(catTitle)
    catCardTitle.appendChild(catCardTitleH1);
    let productsFound = document.getElementById('products-found');
     catProdArr = await fetchProductByCat(urlCat);

    //pass category product to asideBrand function
    asideBrandFn(catProdArr);
        // productsFound.append()
    addProdFn(urlCat);
    addProdFn(urlCat);
    addProdFn(urlCat);
    addProdFn(urlCat);
}
async function addProdFn(urlCat){
    let catProdDiv = document.querySelector('.cat-prod-div')
     catProdArr = await fetchProductByCat(urlCat);
    let urlString = new URLSearchParams(window.location.search);
    let filter = urlString.get('filter');
    let brand = urlString.get('brand');
    let rating = urlString.get('rating');
    let minPrice = urlString.get('minPrice');
    let maxPrice = urlString.get('maxPrice');
    let products = catProdArr.products;
    let productNew = products;
    if(filter != null){
        let searchHead = document.querySelector('.search-heading');
        // if (brand != null ){
        //     prod
        // }
        // products.forEach((product)=>{
            if(brand != null && brand!=""){
                searchHead.append(document.createTextNode('Showing results for '+brand+' '))
                productNew = products.filter(item =>  item.brand == brand);
            }
            if(rating != null && rating!=""){
                rating = rating.toString();
                console.log(productNew,'--productNew within rating check')
                for(let i=0;i<rating.length;i++){
                
                    let digit = parseInt(rating.charAt(i));
                    console.log('rating digit check',digit)
                    productNew = productNew.filter(item => Math.trunc(item.rating) == digit);
                    console.log('after filter product',productNew);
                }
                console.log('inside rating check',productNew)
            } 
            if(minPrice!=null && minPrice!=""){
                productNew = productNew.filter(item =>item.price >= minPrice);
                console.log('inside min price check',productNew)
            }   
            if(maxPrice!=null && maxPrice!=""){
                productNew = productNew.filter(item => item.price <= maxPrice);
                console.log('inside max price check',productNew)
            }
            
    }
    console.log(productNew,'---product new after all filtered');

    let eachProdDiv, prodImgDiv,prodImg,prodText,prodCatP,prodCat,prodH2,prodProd;
    productNew.forEach((product) =>{
    let eachProdDiv = document.createElement('div');
        eachProdDiv.className = 'categories-prod each-product';
        eachProdDiv.onclick = function(){
            openProduct(product.id);
        }
        prodImgDiv = document.createElement('div');
        prodImgDiv.className = 'prod-img-div';
        prodImg = document.createElement('img');
        prodImg.src = product.thumbnail;
        prodImgDiv.append(prodImg);
        eachProdDiv.append(prodImgDiv);
        
        // prod texts 
        prodText = document.createElement('div');
        prodText.className = 'prod-text-div';

        prodCatP = document.createElement('p');
        let slicedTitle = product.category.charAt(0).toUpperCase()+ product.category.slice(1);
        prodCat = document.createTextNode(slicedTitle.replace(/-/g, ' '));
        prodCatP.append(prodCat);
        prodText.append(prodCatP);

        prodH2 = document.createElement('h2');
        prodProd = document.createTextNode(product.title.charAt(0).toUpperCase()+ product.title.slice(1));
        prodH2.append(prodProd);
        prodText.append(prodH2);
        prodText.append(ratingFunction(product.rating));
        let priceAddDiv = document.createElement('div');
            priceAddDiv.className = "price-add-div"

        let priceSpan = document.createElement('span');
            priceSpan.className = "prod-price-span price-span"
        priceSpan.append(document.createTextNode('$'+product.price));
        priceAddDiv.append(priceSpan);

        buttonSpan = document.createElement('span');
        buttonSpan.className = 'prod-btn-span'
        addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'site-button add-to-cart-btn prod-btn';
        // let addIcon = document.createElement('i');
        //     addIcon.classList.add('fa-solid', 'fa-plus');
        //     addIcon.style.color = '#ffffff'
        addToCartBtn.innerHTML ='<i class="fa-solid fa-plus" style="color: #ffffff;"></i> Add' ;
        buttonSpan.append(addToCartBtn);
        priceAddDiv.append(buttonSpan);
        prodText.append(priceAddDiv)
        eachProdDiv.append(prodText);


        //append the item div to html
        catProdDiv.append(eachProdDiv);
    })
}

// fetch all categories
async function allCatFetch(){
    let response = await fetch('https://dummyjson.com/products/categories');
    let fetchedCat = await response.json();
    return fetchedCat;
}
// 
async function fetchProductByCat(urlCat){
    let response = await fetch('https://dummyjson.com/products/category/'+urlCat);
    return response.json();
}

