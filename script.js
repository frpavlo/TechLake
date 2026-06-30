function saveToLocalStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
    return true;
}

function loadFromLocalStorage(name) {
    const data = localStorage.getItem(name);
    return JSON.parse(data);
}

const productsContainer = document.querySelector("#products-container");
const cartContainer = document.querySelector(".cart-container")

let products = null;

let myCart = loadFromLocalStorage("cart");
if (myCart == null) myCart = {};

function addToCart(id, d) {
    if (myCart[id] == undefined) myCart[id] = 0;
    myCart[id] += d;
    if (myCart[id] <= 0) delete myCart[id];
    saveToLocalStorage("cart", myCart);

    renderCart();
}

async function loadProducts() {
    let response = await fetch("./products.json")
    products = await response.json()

    console.log("Підвантажені продукти:", products)
}

function renderProductCard(product) {
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 text-center border-0 shadow-sm product-card">
            <img src="${product.image}" class="card-img-top p-3" alt="${product.name}">

            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">${product.name}</h5>
              
              <div class="mt-auto">
                <p class="card-text fs-4 fw-bold text-success">$${product.price}</p>
                <button class="btn text-white w-100 btn-buy fw-bold" onclick="addToCart(${product.id}, 1)">BUY</button>
              </div>
            </div>
          </div>
        </div>
    `;
}

function renderCartCard(product) {
    return `
        <div class="row">
          <div class="card h-100 text-center border-0 shadow-sm product-card">
            <div class="card-body d-flex flex-row">
              <h5 class="card-title fw-bold">${product.name}</h5>
              
              <div class="mt-auto">
                <p class="card-text fs-4 fw-bold text-success">$${product.price}</p>
                <button class="add-btn" onclick="addToCart(${product.id}, 1)">+</button>
                <p class="card-text fs-4 fw-bold text-success">${myCart[product.id]}</p>
                <button class="add-btn" onclick="addToCart(${product.id}, -1)">-</button>
              </div>
            </div>
          </div>
        </div>
    `;
}

async function renderProducts() {
    if (products === null) await loadProducts();
    if (productsContainer === null) return;

    productsContainer.innerHTML = '';
    products.forEach(function (product) {
        productsContainer.innerHTML += renderProductCard(product)
    })
}

async function renderCart() {
    if (products === null) await loadProducts();
    if (cartContainer === null) return;

    let cartProducts = products.filter(product => Object.keys(myCart).includes(String(product.id)))

    cartContainer.innerHTML = '';
    cartProducts.forEach(function (product) {
        cartContainer.innerHTML += renderCartCard(product)
    })
}



renderProducts()
renderCart()