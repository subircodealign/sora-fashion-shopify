document.addEventListener("DOMContentLoaded", function () {
  const cartDrawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");

  // Open Drawer
  function openCart() {
    cartDrawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(() => {
      loadCart();
    }, 100);
  }

  // Close Drawer
  function closeCart() {
    cartDrawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
  }

  openCartBtn?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);

  // Load Cart Contents
  function loadCart() {
    fetch("/cart.js")
      .then((res) => res.json())
      .then((data) => {
        const cartContainer = document.getElementById("cart-items");
        const emptyText = document.getElementById("cart-empty");
        const total = document.getElementById("cart-total");

        cartContainer.innerHTML = "";

        if (data.items.length === 0) {
          emptyText.classList.remove("hidden");
          total.innerText = "0$ USD";
          return;
        }

        emptyText.classList.add("hidden");

        let totalPrice = 0;

        data.items.forEach((item) => {
          totalPrice += item.line_price;

          cartContainer.innerHTML += `
            <div class="cart-item flex gap-4 border p-4 rounded relative items-start" data-key="${item.key}" data-variant-id="${item.variant_id}">
              <img src="${item.image}" alt="${item.product_title}" class="w-20 h-20 object-cover rounded" />
              <div class="flex-1 pr-6">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">${item.product_title}</p>
                    <p class="text-gray-500 text-sm">${item.variant_title || ""}</p>
                  </div>
                  <button class="remove-item text-gray-400 hover:text-red-600 w-5 h-5 mt-1" aria-label="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="text-black font-semibold mt-1">${(item.price / 100).toFixed(2)}$</p>
                <div class="mt-3 flex items-center border rounded w-max">
                  <button class="decrease-qty px-3 text-xl" aria-label="Decrease quantity">−</button>
                  <span class="px-2 min-w-[20px] text-center">${item.quantity}</span>
                  <button class="increase-qty px-3 text-xl" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>
          `;
        });

        total.innerText = (totalPrice / 100).toFixed(2) + "$ USD";
        updateCartIconCount();
      });
  }

  // Add to Cart (no auto open drawer)
window.addToCart = function(variantId, quantity = 1) {
  fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: variantId, quantity })
  }).then(() => {
    // Optional: update cart icon count without opening drawer
    updateCartIconCount();
  });
}


  // Update Quantity by key
  function updateQuantity(key, quantity) {
    if (quantity < 1) return;
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity })
    }).then(() => {
      loadCart();
      updateCartIconCount();
    });
  }

  // Remove Item by key
  function removeItem(key) {
    if (!key) return;
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity: 0 })
    }).then(() => {
      loadCart();
      updateCartIconCount();
    });
  }

  // Update cart icon count in navbar
  function updateCartIconCount() {
    fetch("/cart.js")
      .then(res => res.json())
      .then(data => {
        const countEl = document.getElementById("cart-count");
        if (countEl) {
          countEl.innerText = data.item_count;
          countEl.classList.toggle("hidden", data.item_count === 0);

          // Bounce animation
          countEl.classList.remove("scale-110");
          void countEl.offsetWidth;
          countEl.classList.add("scale-110");
          setTimeout(() => countEl.classList.remove("scale-110"), 200);
        }
      });
  }

  // Cart drawer button click handling (remove, increase, decrease)
  cartItemsContainer?.addEventListener("click", function (e) {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;

    const key = itemEl.getAttribute("data-key");
    const variantId = itemEl.getAttribute("data-variant-id");

    if (e.target.closest(".remove-item")) {
      e.preventDefault();
      e.stopPropagation();
      removeItem(key);
      return;
    }

    // For quantity buttons, we need to get the current quantity from cart.js for that key
    if (e.target.closest(".increase-qty") || e.target.closest(".decrease-qty")) {
      fetch("/cart.js")
        .then(res => res.json())
        .then(cart => {
          const item = cart.items.find(i => i.variant_id == variantId);
          if (!item) return;

          if (e.target.closest(".increase-qty")) {
            updateQuantity(item.key, item.quantity + 1);
          }

          if (e.target.closest(".decrease-qty")) {
            if (item.quantity > 1) {
              updateQuantity(item.key, item.quantity - 1);
            }
          }
        });
    }
  });

  // Add event listeners to all add-to-cart buttons with class "add-to-cart"
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const variantId = btn.dataset.variant;
      window.addToCart(variantId);
    });
  });
});