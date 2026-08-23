
    //Author: Shaun Mammano
    //Date: 26 Aug 2026
    //Purpose: 4.6

// Author: Shaun Mammano
// Date: 26 Aug 2026
// Purpose: 4.6

let stock = {
    "Aurora Vase": 4,
    "Ember Bowl": 3,
    "Crystal Wave": 2,
    "Solar Lantern": 5,
    "Frost Pendant": 1,
    "Nebula Orb": 0
};

let cart = []; // REQUIRED

// Add to Cart
function addToCart(name, price) {

    if (stock[name] <= 0) return; // Out of stock

    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    stock[name]--; // reduce stock

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("stock", JSON.stringify(stock));

    updateCartDisplay();
    updateStockDisplay();
    animateAdd(name);

    sessionStorage.setItem(
        "sessionCount",
        Number(sessionStorage.getItem("sessionCount") || 0) + 1
    );
}

// Load cart + stock
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}
if (localStorage.getItem("stock")) {
    stock = JSON.parse(localStorage.getItem("stock"));
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItemsDiv.innerHTML = "";

    let totalItems = 0;
    let totalCost = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalCost += item.price * item.quantity;

        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name} — $${item.price.toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalCost.toFixed(2);

    localStorage.setItem("cart", JSON.stringify(cart));
}

// Change Quantity
function changeQuantity(name, amount) {
    let item = cart.find(product => product.name === name);
    if (!item) return;

    item.quantity += amount;

    if (amount < 0) {
        stock[name]++; // restore stock
    }

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.name !== name);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("stock", JSON.stringify(stock));

    updateCartDisplay();
    updateStockDisplay();
}

// Clear Cart
document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    updateCartDisplay();
});

// Checkout
document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.cookie = "lastPurchased=" +
        cart.map(item => item.name).join(", ") + "; path=/;";

    alert("Thank you for your purchase!");
    cart = [];
    localStorage.removeItem("cart");
    updateCartDisplay();
});

// Update Stock Display
function updateStockDisplay() {
    document.querySelectorAll(".product-card").forEach(card => {
        const name = card.querySelector("h3").textContent;
        const stockText = card.querySelector(".stock");
        const button = card.querySelector("button");

        stockText.textContent =
            stock[name] > 0 ? `In stock: ${stock[name]}` : "Out of stock";

        if (stock[name] <= 0) {
            button.disabled = true;
            card.style.opacity = "0.5";
            card.style.cursor = "not-allowed";
            card.title = "Out of Stock";
        } else {
            button.disabled = false;
            card.style.opacity = "1";
            card.style.cursor = "pointer";
            card.title = "";
        }
    });
}

// Add-to-cart animation
function animateAdd(name) {
    const card = [...document.querySelectorAll(".product-card")]
        .find(c => c.querySelector("h3").textContent === name);

    card.style.transition = "transform 0.2s, background 0.2s";
    card.style.transform = "scale(1.05)";
    card.style.background = "#d9f7d9";

    setTimeout(() => {
        card.style.transform = "scale(1)";
        card.style.background = "";
    }, 200);
}

// Load last purchased cookie
function getLastPurchased() {
    let cookies = document.cookie.split("; ");
    for (let c of cookies) {
        if (c.startsWith("lastPurchased=")) {
            return c.replace("lastPurchased=", "");
        }
    }
    return "None";
}

document.getElementById("last-purchased").textContent = getLastPurchased();

// Initial stock update
updateStockDisplay();
updateCartDisplay();
