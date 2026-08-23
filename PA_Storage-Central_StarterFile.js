
    //Author: Shaun Mammano
    //Date: 26 Aug 2026
    //Purpose: 4.6

let stock = {
    "Aurora Vase": 4,
    "Ember Bowl": 3,
    "Crystal Wave": 2,
    "Solar Lantern": 5,
    "Frost Pendant": 1,
    "Nebula Orb": 0
};
let cart = []; // You MUST have this at the top

function addToCart(name, price) {

    // Prevent adding if out of stock
    if (stock[name] <= 0) return;

    // Find item in cart
    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    // Reduce stock
    stock[name]--;

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("stock", JSON.stringify(stock));

    // Update displays
    updateCartDisplay();
    updateStockDisplay();

    // Animation
    animateAdd(name);

    // Session counter
    sessionStorage.setItem(
        "sessionCount",
        Number(sessionStorage.getItem("sessionCount") || 0) + 1
    );
}


  // Load cart from localStorage
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartDisplay();
}

// Load stock from localStorage
if (localStorage.getItem("stock")) {
    stock = JSON.parse(localStorage.getItem("stock"));
    updateStockDisplay();
}


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
}

function changeQuantity(name, amount) {
    let item = cart.find(product => product.name === name);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.name !== name);
    }

    updateCartDisplay();
}

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    updateCartDisplay();
});

document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for your purchase!");
    cart = [];
    updateCartDisplay();
});

document.querySelectorAll(".product-card button").forEach(button => {
    button.addEventListener("click", (event) => {
        const card = event.target.closest(".product-card");
        const name = card.querySelector("h3").textContent;
        const price = parseFloat(card.querySelector(".price").textContent.replace("$", ""));
        addToCart(name, price);
    });
});
// Save cart + stock to localStorage
localStorage.setItem("cart", JSON.stringify(cart));
localStorage.setItem("stock", JSON.stringify(stock));

// Clear cart
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

    // Save last purchased items in a cookie
    document.cookie = "lastPurchased=" + 
        cart.map(item => item.name).join(", ") + "; path=/;";

    alert("Thank you for your purchase!");
    cart = [];
    localStorage.removeItem("cart");
    updateCartDisplay();
});

// Update stock display
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
