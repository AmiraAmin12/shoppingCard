//cash 
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overly');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');
let cart = [];
//buttons
let buttonsDOM = [];


//getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}
//display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += ` 
            <articl class="product">
            <div class="img-container">
                <img src= ${product.image} alt="product" class="product-img">
                <button class="bag-btn"  data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>           
            </div>    
              <h3> ${product.title}</h3>  
              <h4>$ ${product.price}16</h4>  
        </articl>
            `;
        });
        productsDom.innerHTML = result;
    }

    getBagButtons() {
        //convert it to array
        const buttons = [...document.querySelectorAll('.bag-btn')]
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } else {
                button.addEventListener("click", (event) => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    //get product from products
                    let cartItem = {...Storage.getProduct(id), amount: 1 };

                    //Add them to the cart
                    cart = [cart, cartItem];

                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart)
                        //display cart item
                    this.addCartItem(cartItem);
                    //show the crt
                    this.showCart()

                });
            }
        });
    }

    setCartValues(cart) {
        let tempTotal = 0,
            itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
            console.log(itemsTotal)
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        //console.log(cartTotal, cartItems);
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item')
        div.innerHTML = `  <img src=".${item.image}" alt="product1">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount"  >${item.amount}</p>
            <i class="fas fa-chevron-down"  data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div)
            //  console.log(cartContent)
    }
    showCart() {
            cartOverlay.classList.add("transparentBcg");
            cartDom.classList.add("showCart")
        }
        /* setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart)
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);


}*/
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));

    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDom.classList.remove("showCart")
    }
}
//local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'))
        return products.find(product => product.id === id)
    }
    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        return localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem("art")) : [];

    }

}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //setup the application
    // ui.setupAPP();
    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products)
            //static methode so no need to creat instance
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons()
    });

});