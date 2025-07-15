document.addEventListener("DOMContentLoaded", function () {
  const cartDrawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyText = document.getElementById("cart-empty");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");

  // Open drawer
  function openCart() {
    cartDrawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    loadCart();
  }

  // Close drawer
  function closeCart() {
    cartDrawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
  }

  openCartBtn?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);

  // Update navbar cart count (unique product count)
  function updateCartCount(cart) {
    if (!cartCountEl) return;
    const uniqueCount = cart.items.filter(item => item.quantity > 0).length;
    cartCountEl.textContent = uniqueCount;
    cartCountEl.classList.toggle("hidden", uniqueCount === 0);
  }

  // Force cart count update
  function forceUpdateCartCountFromServer() {
    fetch("/cart.js", { cache: "no-store" })
      .then(res => res.json())
      .then(cart => updateCartCount(cart));
  }

  // Load and render cart
  function loadCart() {
    fetch("/cart.js", { cache: "no-store" })
      .then((res) => res.json())
      .then((cart) => {
        renderCartItems(cart);
        updateCartCount(cart);
      })
      .catch((err) => console.error("Error loading cart:", err));
  }

  // Render cart drawer items
  function renderCartItems(cart) {
    const validItems = cart.items.filter(item => item.quantity > 0);
    if (validItems.length === 0) {
      cartItemsContainer.innerHTML = "";
      cartEmptyText.classList.remove("hidden");
      cartTotalEl.textContent = "0.00 $";
      return;
    }

    cartEmptyText.classList.add("hidden");

    const html = validItems.map(item => `
      <div class="cart-item flex gap-4 border p-4 rounded relative items-start" data-variant-id="${item.variant_id}">
        <img src="${item.image}" alt="${item.product_title}" class="w-20 h-20 object-cover rounded" />
        <div class="flex-1 pr-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">${item.product_title}</p>
              <p class="text-gray-500 text-sm">${item.variant_title || ""}</p>
            </div>
            <button class="remove-item text-gray-400 hover:text-red-600 w-5 h-5 mt-1" title="Remove item" aria-label="Remove item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-black font-semibold mt-1">${(item.price / 100).toFixed(2)} $</p>
          <div class="mt-3 flex items-center border rounded w-max">
            <button class="decrease-qty px-3 text-xl" aria-label="Decrease quantity">−</button>
            <span class="px-2 min-w-[20px] text-center">${item.quantity}</span>
            <button class="increase-qty px-3 text-xl" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    `).join("");

    cartItemsContainer.innerHTML = html;
    cartTotalEl.textContent = (cart.total_price / 100).toFixed(2) + " $";
  }

  // Update item quantity or remove
  function updateCartItemByVariantId(variantId, quantity) {
    fetch("/cart/update.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: { [variantId]: quantity },
      }),
    })
      .then((res) => res.json())
      .then((cart) => {
        renderCartItems(cart);
        updateCartCount(cart);
        forceUpdateCartCountFromServer(); // extra safe update
      })
      .catch((err) => {
        console.error("Cart update failed:", err);
        loadCart();
      });
  }

  // Debounce helper for quantity updates
  let debounceTimer;
  function debounceUpdate(variantId, quantity) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updateCartItemByVariantId(variantId, quantity);
    }, 200);
  }

  // Event delegation for quantity buttons & remove
  cartItemsContainer.addEventListener("click", function (e) {
    const cartItem = e.target.closest(".cart-item");
    if (!cartItem) return;

    const variantId = cartItem.getAttribute("data-variant-id");
    const qtyEl = cartItem.querySelector("span");
    const currentQty = parseInt(qtyEl.textContent, 10);

    if (e.target.closest(".remove-item")) {
      e.preventDefault();
      updateCartItemByVariantId(variantId, 0);
    }

    if (e.target.closest(".increase-qty")) {
      e.preventDefault();
      debounceUpdate(variantId, currentQty + 1);
    }

    if (e.target.closest(".decrease-qty")) {
      e.preventDefault();
      if (currentQty > 1) {
        debounceUpdate(variantId, currentQty - 1);
      } else {
        updateCartItemByVariantId(variantId, 0);
      }
    }
  });

  // Global add to cart
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const variantId = btn.dataset.variant;
      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 }),
      })
        .then((res) => res.json())
        .then(() => {
          loadCart();
          forceUpdateCartCountFromServer();
        });
    });
  });

  // Initial cart count on load
  forceUpdateCartCountFromServer();
});
