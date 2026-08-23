/*
    Author: Shaun Mammano
    Date: 26 Aug 2026
    Purpose: 4.6
    let cart = [];
*/
function addToCart(name, price) {
    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartDisplay();
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


