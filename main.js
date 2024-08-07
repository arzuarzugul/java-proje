// varibals
const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn=document.querySelector(".btn-clear");
const cartItems =document.querySelector(".cart-items");
const cartTotal=document.querySelector(".total-value");
const cartContent=document.querySelector(".cart-list");
const productsDom=document.querySelector("#products-dom");


let cart=[];
let buttonsDom=[];
 

class Products{
async getproducts(){
    try{
        let result=await fetch("https://669e8ac39a1bda368006e711.mockapi.io/products");
        let data= await result.json();
        let products=data;
        console.log(products)
        return products;
         
    }
    catch(error) {
        console.log(error);

    }
   
}
}


class UI{
    displayProducts(products){
    let result="";
    products.forEach(item => {
        result += `<div class="col-lg-4 col-md-6">
        <div class="product">
        <div class="product-image">
          <img src="${item.image}" alt="product" />
        </div>
        <div class="product-hover">
          <span class="product-title">${item.title}"</span>
          <span class="product-price">$ ${item.price}</span>
          <button class="btn-add-to-card" data-id=${item.id}>
             <i class="fas fa-cart-shopping"></i>
          </button>
        </div>
      </div>
      </div>`});
  
    productsDom.innerHTML=result;
  }

    getBagButtons(){
        const buttons=[...document.querySelectorAll(".btn-add-to-cart")];
        buttonsDom=buttons;
        buttons.forEach(button=>{
            let id=button.dataset.id;
            let inCart=cart.find(item=>item.id===id);
            if(inCart){
                button.setAttribute("disabled","disabled");
                button.opacity=".3";
            }
            else{
                button.addEventListener("click",event=>{
                    event.target.disabled=true;
                    event.target.style.opacity=.3;
                    //*get product from product
                    let cartItem={...Storage.getproduct(id),amount:1}
                //*add product to the cart
                cart=[...cart,cartItem];
                //*save cart in local starage
                Storage.saveCart(cart);
                //*save cart values
                this.saveCartValues(cart);
                //*display cart item
                this.addCartItem(cartItem)
                //*show the cart
                this.showCart(
                  
                );
               
                
                });
            }
          })
       
    
    }
   
  
   
   
    saveCartValues(cart){
      let tempTotal=0;
      let itemsTotal=0;
      cart.map(item=>{
          tempTotal+=item.price*item.amount;
          itemsTotal+=item.amount; 
         });
  
 cartTotal.innerText=parseFloat(tempTotal.toFixed(2));
  cartItems.innerText=itemsTotal;
  }
  addCartItem(item){
    const li=document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML=` <div class="cart-left">
            <div class="cart-left-image">
              <img src="${item.image}" alt="" />
            </div>
            <div class="cart-left-info">
              <a href="${item.title}" class="cart-left-info-title">table</a>
              <span class="cart-left-info-price">$ ${item.price}</span>
            </div>
          </div>
          <div class="cart-right">
            <div class="cart-right-quantity">
              <button class="quantity-minus" data-id=${item.id}>
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">0</span>
              <button class="quantity-minus" data-id=${item.id}>
                <i class="fas fa-plus"></i>
              </button>
              <span class=quantity">0</span>
              <button class="quantity-plus" data-id=${item.id}>
              <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="cart-right-remove">
              <button class="cart-remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>`;
          cartContent.appendChild(li);
}
showCart(){
  cartBtn.click();
}
setupAPP(){
  cart=Storage.getCart();
  this.saveCartValues(cart);
  this.populateCart(cart);

}
populateCart(cart){
  cart.forEach(item=>this.addCartItem(item));
}
cartLogic(){
  clearCartBtn("click", ()=>{this.clearCart()})
  cartContent.addEventListener("click",event=>{
    if(event.target.classList.contains("cart-remove-btn")){
      let removeItem=event.target;
      let id=removeItem.dataset.id;
      removeItem.parentElement.parentElement.parentElement.remove();
      this.removeItem(id);
    }
    else if(
      event.target.classList.contains("quantity-minus"))
      {let lowerAmount=event.target;
        let id=lowerAmount.dataset.id;
        let tempItem=cart.find(item=>item.id===id);
        tempItem.amount=tempItem.amount-1;
        if(tempItem.amount>0){
          Storage.saveCart(cart);
          this.saveCartValues(cart);
          lowerAmount.nextElementSibling.innerText=tempItem.amount;


        }
        else{lowerAmount.parentElement.parentElement.parentElement.remove();
             this.removeItem(id);
        }

    }else if(event.target.classList.contains("quantity-plus"))
    {
      let addAmount=event.target;
        let id=lowerAmount.dataset.id;
        let tempItem=cart.find(item=>item.id===id);
        tempItem.amount=tempItem.amount+1;
        Storage.saveCart(cart);
        this.saveCartValues(cart);
        addAmount.previousElementSibling.innerText=tempItem.amount;
    }
  })
}
clearCart(){
  let cartItem=cart.map(item=>item.id);
  cartItem.forEach(id=>this.removeItem(id));
  while(cartContent.children.length>0){
    cartContent.removeChild(cartContent.children[0])
  }
} 
   removeItem(id){
  cart=cart.filter(item=>item.id !==id);
  this.saveCartValues(cart);
  Storage.saveCart(cart);
  let button=this.getSingleButton(id);
  button.disabled=false;
  button.style.opacity="1"; 

}
getSingleButton(id){
  return buttonsDom.find(button=>button.dataset.id===id);
}
}

    




class Storage{
    static saveProducts(products){
        localStorage.setItem("product", JSON.stringify(products));
    }
    static getproducts(id){
        let products=JSON.parse(localStorage.getItem("products"));
       return products.find(product=>product.id===id)
    }
     //*save cart in localstoreage
     static saveCart(cart){
     localStorage.setItem("cart",JSON.stringify(cart));
    }
     static getCart(){
       return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[]
     }

}
/*---------------*/
document.addEventListener("DOMContentLoaded", ()=>{
const ui=new UI
const products=new Products();

ui.setupAPP();
products.getproducts().then(products=>{
    ui.displayProducts(products);Storage.saveProducts(products);})
     .then(()=>{ui.getBagButtons().
    ui.cartLogic();
     })
      
});