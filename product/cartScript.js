var cartArr = localStorage.getItem('cart-list') != null ? JSON.parse(localStorage.getItem('cart-list')) :  [];


//cart page load
async function cartLoadFn(){
    let cartProdArr=[];
    let allProds = await allproductsFetch();
    console.log('cart arr in page load----',cartArr);
    cartArr.forEach(element => {
        allProds.products.forEach(prod =>{
            if(prod.id == element.prodid){
                prod.quantity = element.prodqty;
                cartProdArr.push(prod);
            } 
        })
    });
    showCartFn(cartProdArr);
}

// show in html
function showCartFn(cartProdArr){
    let tbody = document.getElementById('cart-tbl-body');
    let prodTr,prodImgTd, titleTd, priceTd, qtyTd, qtySpan,qtySpanDec,qtySpanInc,qtySpanBox,delTd;
    let totalDiv, totalPrice = 0;
    let checkoutBtnDiv,checkoutBtn;
    cartProdArr.forEach(product =>{

// For product image and title 
        prodTr = document.createElement('tr');
            prodTr.className = 'prod-tr';
            prodImgTd = document.createElement('td');
                prodImgTd.innerHTML ='<img src ='+product.thumbnail+' class = "cart-prod-img">';
            titleTd = document.createElement('Td');
            titleTd.className = 'prod-col title-td'
            titleTd.appendChild(prodImgTd);
            titleTd.appendChild(document.createTextNode(product.title));    
// for product quantity
            qtyTd = document.createElement('td');
            qtyTd.className = 'qty-column';
            qtySpan = document.createElement('span');
            qtySpan.className = 'qty-div';
    // for decrease quantity button
            qtySpanDec = document.createElement('span');
            qtySpanDec.className = "change-qty inc-dec-wish decrease-qty";
            qtySpanDec.onclick= function() {
                incDecBtnClick(1, product.id);
            };
            qtySpanDec.innerHTML = '<i class="fas fa-regular fa-minus fa-lg"></i>';
            qtySpan.appendChild(qtySpanDec);
    //for quantity box 
            qtySpanBox = document.createElement('span');
            qtySpanBox.className = "change-qty to-buy-quantity";
            qtySpanBox.innerHTML = "<input type='number' name='qty-box' class='qty-box' id='qty-box-"+product.id+"' min='1' value='"+product.quantity+"' disabled></input>";
            qtySpan.appendChild(qtySpanBox);
    // for increase quantity button
            qtySpanInc = document.createElement('span');
            qtySpanInc.className = "change-qty inc-dec-wish increase-qty";
            qtySpanInc.onclick= function() {
                incDecBtnClick(2, product.id);
            };

            qtySpanInc.innerHTML = '<i class="fas fa-regular fa-plus fa-lg"></i>';
            qtySpan.appendChild(qtySpanInc);
            qtyTd.appendChild(qtySpan);
// for price area
            priceTd = document.createElement('Td');
            priceTd.className='price-column';
            priceTd.appendChild(document.createTextNode('$'+discountCalc(product.price,product.discountPercentage,product.quantity)));

// for removing item from cart 
            delTd = document.createElement('td');
                delTd.className='del-td'
            delTd.innerHTML = '<i class="fa fa-duotone fa-trash-can"></i>';
                delTd.onclick = function(){
                    console.log('rmeove button pressed in cart')
                    cartProdArr = cartProdArr.filter(item => item.id !=product.id);
                    cartArr = cartArr.filter((element) => element.prodid != product.id);
                    localStorage.setItem('cart-list',JSON.stringify(cartArr));
                    this.parentNode.style.display = 'none';
                    console.log(cartProdArr,'---cartProd array within onclick')
                    console.log(cartArr,'---cartArray within onclick');
                }
//appending table elements                
            prodTr.appendChild(titleTd);
            prodTr.appendChild(qtyTd);
            prodTr.appendChild(priceTd);
            prodTr.appendChild(delTd);
            tbody.appendChild(prodTr);

// calculate total price
    totalPrice+=parseFloat(discountCalc(product.price,product.discountPercentage,product.quantity));
    pdfBody += `<span class = 'pdf-item-col'>${product.title}</span>
                <span class = 'pdf-qty-col'>${product.quantity}</span>
                <span class = 'pdf-price-col'>${product.price}</span>
                <span class = 'pdf-total-col'>${product.price*product.quantity}</span>`;
 })

// to show total amount
    totalDiv = document.getElementById('total-div');  
    let totalText = document.createElement('span');
    totalText.innerHTML = '<strong>Total Price: </strong>$'+totalPrice.toFixed(2);
    
    totalDiv.appendChild(totalText);

// for checkout button
    if( cartProdArr!= null){
        checkoutBtnDiv = document.createElement('div');
        checkoutBtn = document.createElement('button');
        checkoutBtn.innerHTML = "Checkout"; 
        checkoutBtn.id = 'checkout-btn'
        checkoutBtn.onclick = function(){
            printDiv(pdfBody);
        }
        checkoutBtn.className = 'site-button checkout-btn';
        checkoutBtnDiv.appendChild(checkoutBtn);
        totalDiv.appendChild(checkoutBtnDiv);
    }    

}
var pdfBody;

// calculate discount amount
function discountCalc(price,disc,qty){
    let priceDiscounted = price- (price*disc/100);
    return (priceDiscounted*qty).toFixed(2);
}

// for qty increase/decrease in cart 
let incDecBtnClick = (clicked, id)=>{
    let toBuyQty = document.getElementById('qty-box-'+id);
    switch(clicked){
        case 1:
            if(toBuyQty.value == 0){
                toBuyQty.value = 0;       
            }else{
                toBuyQty.value = parseInt(toBuyQty.value)-1;          
            }
            break;
        case 2:
            toBuyQty.value = parseInt(toBuyQty.value) +1;         
            break;
    }
}
// fetch all products
async function allproductsFetch(){
    let response = await fetch('https://dummyjson.com/products?skip=0&limit=100');
    return response.json();
}

// when checkout pressed
function printDiv(pdfBody) {
    let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
  
    mywindow.document.write(`<html><head><title>Receipt</title>`);
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>Receipt</h1>');
    mywindow.document.write("<h2 class='receipt-body'><span></span><span class = 'pdf-item-col'>Item</span><span class = 'pdf-qty-col'>Qty</span><span class = 'pdf-price-col'>Price</span><span class = 'pdf-total-col'>Total</span>");
    mywindow.document.write(`<div>${pdfBody}</div>`);
    mywindow.document.write('</body></html>');
  
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
  
    // mywindow.print();
    // mywindow.close();
  
    return true;
  }