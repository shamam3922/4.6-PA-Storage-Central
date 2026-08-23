
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


