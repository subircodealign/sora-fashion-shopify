document.addEventListener("DOMContentLoaded", function () {

  const cartDrawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("cart-toggle");
  const closeCartBtn = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");

  function openCart() {
    cartDrawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(loadCart, 100);
  }
  function closeCart() {
    cartDrawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
  }

  openCartBtn?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);

  function loadCart() {
    fetch("/cart.js", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        const validItems = data.items.filter(i => i.quantity > 0);
        const emptyText = document.getElementById("cart-empty");
        const total = document.getElementById("cart-total");
        cartItemsContainer.innerHTML = "";

        if (validItems.length === 0) {
          emptyText.classList.remove("hidden");
          total.innerText = "0$ USD";
          updateCartIconCount();
          return;
        }
        emptyText.classList.add("hidden");

        let totalPrice = 0;
        validItems.forEach(item => {
          totalPrice += item.line_price;
          cartItemsContainer.innerHTML += `
            <div class="cart-item flex gap-4 border p-4 rounded relative items-start"
                 data-variant-id="${item.variant_id}">
              <img src="${item.image}" alt="${item.product_title}" class="w-20 h-20 object-cover rounded" />
              <div class="flex-1 pr-6">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">${item.product_title}</p>
                    <p class="text-gray-500 text-sm">${item.variant_title || ""}</p>
                  </div>
                  <button class="remove-item text-gray-400 hover:text-red-600 w-5 h-5 mt-1">
                    &times;
                  </button>
                </div>
                <p class="text-black font-semibold mt-1">${(item.price / 100).toFixed(2)}$</p>
                <div class="mt-3 flex items-center border rounded w-max">
                  <button class="decrease-qty px-3 text-xl">−</button>
                  <span class="px-2 min-w-[20px] text-center">${item.quantity}</span>
                  <button class="increase-qty px-3 text-xl">+</button>
                </div>
              </div>
            </div>`;
        });

        total.innerText = (totalPrice / 100).toFixed(2) + "$ USD";
        updateCartIconCount();
      })
      .catch(console.error);
  }

  window.addToCart = function (variantId, quantity = 1) {
    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: variantId, quantity })
    })
      .then(() => updateCartIconCount())
      .catch(console.error);
  };

  function changeCartItem(variantId, quantity) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: variantId, quantity })
    })
      .then(res => res.json())
      .then(() => {
        setTimeout(() => {
          loadCart();
          updateCartIconCount();
        }, 300);
      })
      .catch(console.error);
  }

  function updateCartIconCount() {
    fetch("/cart.js", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        const countEl = document.getElementById("cart-count");
        if (countEl) {
          countEl.innerText = data.item_count;
          countEl.classList.toggle("hidden", data.item_count === 0);
          countEl.classList.add("scale-110");
          setTimeout(() => countEl.classList.remove("scale-110"), 200);
        }
      })
      .catch(console.error);
  }

  cartItemsContainer?.addEventListener("click", e => {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;

    const variantId = itemEl.getAttribute("data-variant-id");
    if (!variantId) return;

    if (e.target.closest(".remove-item")) {
      changeCartItem(variantId, 0);
      return;
    }

    if (e.target.closest(".increase-qty") || e.target.closest(".decrease-qty")) {
      e.preventDefault();
      fetch("/cart.js", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          const item = data.items.find(i => i.variant_id == variantId);
          if (!item) return;

          const newQty = e.target.closest(".increase-qty") ?
            item.quantity + 1 : item.quantity - 1;

          changeCartItem(variantId, Math.max(newQty, 0));
        })
        .catch(console.error);
    }
  });




  // Add to cart buttons (for product cards/buttons outside cart)
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const variantId = btn.dataset.variant;
      window.addToCart(variantId);
    });
  });

  // Initial load cart count
  updateCartIconCount();
});
