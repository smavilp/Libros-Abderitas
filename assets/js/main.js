//Variables
const loader = document.getElementById("loader")
const logo = document.getElementById("logo")
const header = document.getElementById("header")
const cartView = document.getElementById("cart-view")
const openCartViewBtn = document.getElementById("open-cart-view")
const closeCartViewBtn = document.getElementById("close-cart-view")
const menuView = document.getElementById("menu-view")
const openMenuViewBtn = document.getElementById("open-menu-view")
const closeMenuViewBtn = document.getElementById("close-menu-view")
const articlesContainer = document.getElementById("articles-container")
const cartContainer = document.getElementById("cart-container")
const db = [
  {
    id: 1,
    name:"Sabidurías de la antigüedad",
    price:"14.00",
    image:"assets/images/sabidurias.jpeg",
    category:"book",
    quantity: 5,
  },
  {
    id: 2,
    name:"Libertinos barrocos",
    price:"24.00",
    image:"assets/images/libertinos.jpeg",
    category:"book",
    quantity: 7,
  },
  {
    id: 3,
    name:"La fuerza de existir",
    price:"24.00",
    image:"assets/images/fuerza-existir.jpeg",
    category:"book",
    quantity: 10,
  }
]
const products = window.localStorage.getItem("productsDB") ? JSON.parse(window.localStorage.getItem("productsDB")):db
let cart = window.localStorage.getItem("cartDB")? JSON.parse(window.localStorage.getItem("cartDB")) : [];
const itemsCounter = document.getElementById("items-counter")
const cartItemsCounter = document.getElementById("cart-items-counter")
const totalAccount = document.getElementById("total-account")
const checkoutBtn = document.getElementById("checkout-btn")
const articleBtns = document.getElementById("article-btns")
const homeBtn = document.getElementById("home-btn")
const clearCartBtn = document.getElementById("btn--clear-cart")
const MenuViewHomeLink = document.getElementById("menu-view__a--home")
const MenuViewProductsLink = document.getElementById("menu-view__a--products")
const moonBtn =document.getElementById("moon-btn")
const sunBtn =document.getElementById("sun-btn")

// Functions
const hideLoader = () => {
  setTimeout(()=>{
    loader.classList.add("hidden")
  },1500)
}

const colorHeader = () => {
  if(window.scrollY>0){
    header.classList.add("colored-header")
  }else{
    header.classList.remove("colored-header")
  }
}

const toggleCartView = () => {
  cartView.classList.toggle("hidden")
}

const toggleMenuView = () => {
  menuView.classList.toggle("hidden")
}

const toggleTheme = () => {
  document.body.classList.toggle("dark")
  moonBtn.classList.toggle("dark")
  sunBtn.classList.toggle("dark")
}

const printProducts = () => {
  let html = ""
  products.forEach(product => {
    html +=`
    <article class="products__article article">
      <div class="article__div article__div--img">
        <img class="article__img" src="${product.image}" alt="${product.name}">
      </div>
      <div class="article__div article__div--data">
        <span class="article__span">$${product.price}</span>
        <span class="article__span">| Stock: ${product.quantity}</span>
        <h3 class="article__h3">${product.name}</h3>
        <button class="article__button" data-id="${product.id}">+</button>
      </div>
    </article>    
    `
  });
  articlesContainer.innerHTML = html
  window.localStorage.setItem("productsDB", JSON.stringify(products))
}

printProducts()


function printCart(){
  let html = ""
  for(const article of cart){
    const product = products.find(p => p.id === article.id)
    html += 
    `
    <article class="cart-view__article">
      <img class="cart-view__img" src="${product.image}" alt="${product.name}">
      <div class="cart-view__div--data">
          <h3 class="cart-view__h3">${product.name}</h3>
          <span class="cart-view__span cart-view__span--stock">
              Stock: ${product.quantity-article.qty} | $${product.price}
          </span>
          <span class="cart-view__span cart-view__span--subtotal">
              Subtotal: $${product.price*article.qty}
          </span>
          <div class="cart-view__div cart-view__div--quantity">
              <div class="cart-view__div cart-view__div--btns" id="article-btns">
                  <button class="cart-view__btn--minus" data-id="${product.id}">-</button>
                  <span class="cart-view__span cart-view__span--units">${article.qty}</span>
                  <button class="cart-view__btn--plus" data-id="${product.id}">+</button>
              </div>
              <button class="cart-view__btn--clear">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24";><path d="M15 2H9c-1.103 0-2 .897-2 2v2H3v2h2v12c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V8h2V6h-4V4c0-1.103-.897-2-2-2zM9 4h6v2H9V4zm8 16H7V8h10v12z"></path></svg>
              </button>
          </div>
      </div>
    </article>
    `
  }
  cartContainer.innerHTML = html
  itemsCounter.innerHTML = totalArticles()
  cartItemsCounter.innerHTML = `${totalArticles()} items`
  totalAccount.innerHTML = `$${totalAmount()}`
  checkoutButtons () 
  window.localStorage.setItem("cartDB",JSON.stringify(cart))
}

printCart()



function addToCart(id, qty =1){
  const product = products.find (p => p.id === id)
  if(product && product.quantity > 0){
    const article = cart.find(a => a.id === id)
    if(article){
      if(checkStock(id,qty+article.qty)){
        article.qty++
      }else{
        window.alert("No hay stock")
      }
    } else {
      cart.push({id,qty})
    }
  } else {
    window.alert("producto agotado")
  }
  printCart()
}

function checkStock(id, qty){
  const product = products.find(p => p.id === id)
  return product.quantity - qty >= 0 
}

function removeFromCart (id, qty = 1){
  const article = cart.find(a => a.id === id)
  if(article && article.qty - qty > 0){
    article.qty--
  } else {
    const confirm = window.confirm("¿Estás seguro?")
    if(confirm){
      cart = cart.filter(a => a.id !== id)
    }
  }
  printCart()
}

function deleteFromCart(id){
  const article = cart.find(a => a.id === id)
  window.alert("¿Estás seguro?")
  cart.splice(cart.indexOf(article),1)
  printCart()
}

function totalArticles(){
  return cart.reduce((acc,article) => acc + article.qty, 0)
}

function totalAmount(){
  return cart.reduce((acc, article) => {
    const product = products.find(p => p.id === article.id)
    return acc + product.price*article.qty
  },0)
}

function clearCart(){
  cart = []
  printCart()
}

function checkout () {
  cart.forEach(article =>{
    const product = products. find(p => p.id === article.id)
    product.quantity -= article.qty
  })
  clearCart ()
  printProducts ()
  window.alert("Gracias por su compra")
  printCart()
}

function checkoutButtons (){
  if(cart.length>0){
    checkoutBtn.removeAttribute("disabled")
    clearCartBtn.removeAttribute("disabled")
  } else {
    checkoutBtn.setAttribute("disabled","disabled")
    clearCartBtn.setAttribute("disabled","disabled")
  }
}

function darkTheme (){
  body.classList.add("dark")
  moonBtn.classList.add("dark")
  sunBtn.classList.add("dark")
}

console.log(logo.attributes[2].value)

//Events
document.addEventListener("DOMContentLoaded",() => hideLoader())
window.addEventListener("scroll",() => colorHeader())
openMenuViewBtn.addEventListener("click", () => toggleMenuView())
closeMenuViewBtn.addEventListener("click", () => toggleMenuView())
openCartViewBtn.addEventListener("click", () => toggleCartView())
closeCartViewBtn.addEventListener("click", () => toggleCartView())
checkoutBtn.addEventListener("click", () => checkout())
articlesContainer.addEventListener("click", function(e){
  const add = e.target
  if(add.tagName === "BUTTON"){
    const id = +add.dataset.id
    addToCart(id)
  }
})
cartContainer.addEventListener("click",function(e){
  const btn = e.target
  const id = +btn.dataset.id
  if(btn.classList.contains("cart-view__btn--minus")){
    removeFromCart(id)
  }
  if(btn.classList.contains("cart-view__btn--plus")){
    addToCart(id)
  }
  if(btn.closest(".cart-view__btn--clear")){
    deleteFromCart(id)
  }
})
homeBtn.addEventListener("click",() => addToCart(1))
clearCartBtn.addEventListener("click", function(e){
  window.alert("¿Estás seguro?")
  const clearBtn = e.target.closest(".cart-view__btn--clear-cart")
  if(clearBtn){
    clearCart()
  }
  clearCart()
})

MenuViewHomeLink.addEventListener("click",()=>toggleMenuView())
MenuViewProductsLink.addEventListener("click",()=>toggleMenuView())
moonBtn.addEventListener("click", () => toggleTheme())
sunBtn.addEventListener("click", () => toggleTheme())
