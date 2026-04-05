//  NAV + MENU + CART TOGGLE

const category_nav_list = document.querySelector(".category_nav_list");
const nav_links = document.querySelector(".nav_links");
const cartBox = document.querySelector(".cart");

function Open_Categ_list() {
  category_nav_list?.classList.toggle("active");
}

function open_Menu() {
  nav_links?.classList.toggle("active");
}

function open_close_cart() {
  cartBox?.classList.toggle("active");
}

// CART STORAGE HELPERS

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//  ADD TO CART

function addToCart(product) {
  let cart = getCart();

  let existing = cart.find((item) => item.id == product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCart();
}

//  UPDATE CART UI

function updateCart() {
  const cart = getCart();

  const cartItemsContainer = document.getElementById("cart_items");
  const checkout_items = document.getElementById("checkout_items");

  let totalPrice = 0;
  let totalCount = 0;

  let cartHTML = "";
  let checkoutHTML = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;

    totalPrice += itemTotal;
    totalCount += item.quantity;

    cartHTML += `
      <div class="item_cart">
        <img src="${item.img}">
        <div class="content">
          <h4>${item.name}</h4>
          <p>$${itemTotal}</p>
          <div class="quantity_control">
            <button class="decrease_quantity" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="Increase_quantity" data-index="${index}">+</button>
          </div>
        </div>
        <button class="delete_item" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    if (checkout_items) {
      checkoutHTML += `
        <div class="item_cart">
          <div class="image_name">
            <img src="${item.img}">
            <div class="content">
              <h4>${item.name}</h4>
              <p>$${itemTotal}</p>
              <div class="quantity_control">
                <button class="decrease_quantity" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="Increase_quantity" data-index="${index}">+</button>
              </div>
            </div>
          </div>
          <button class="delete_item" data-index="${index}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }
  });

  if (cartItemsContainer) cartItemsContainer.innerHTML = cartHTML;
  if (checkout_items) checkout_items.innerHTML = checkoutHTML;

  // totals
  const totalEl = document.querySelector(".price_cart_toral");
  const countHeader = document.querySelector(".count_item_header");

  if (totalEl) totalEl.textContent = `$ ${totalPrice}`;
  if (countHeader) countHeader.textContent = totalCount;

  if (checkout_items) {
    document.querySelector(".subtotal_checkout").textContent =
      `$ ${totalPrice}`;
    document.querySelector(".total_checkout").textContent =
      `$ ${totalPrice + 20}`;
  }
}

// EVENT DELEGATION

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("Increase_quantity")) {
    increaseQuantity(e.target.dataset.index);
  }

  if (e.target.classList.contains("decrease_quantity")) {
    decreaseQuantity(e.target.dataset.index);
  }

  if (e.target.closest(".delete_item")) {
    removeFromCart(e.target.closest(".delete_item").dataset.index);
  }
});

//  QUANTITY CONTROL

function increaseQuantity(index) {
  let cart = getCart();
  cart[index].quantity++;
  saveCart(cart);
  updateCart();
}

function decreaseQuantity(index) {
  let cart = getCart();

  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  }

  saveCart(cart);
  updateCart();
}

function removeFromCart(index) {
  let cart = getCart();
  let removed = cart.splice(index, 1)[0];

  saveCart(cart);
  updateCart();
  updateButoonsState(removed.id);
}

// BUTTON STATE

function updateButoonsState(productId) {
  const buttons = document.querySelectorAll(
    `.btn_add_cart[data-id="${productId}"]`,
  );

  buttons.forEach((btn) => {
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`;
  });
}

//  LOAD PRODUCTS + ADD EVENTS

fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    document.addEventListener("click", function (e) {
      if (e.target.closest(".btn_add_cart")) {
        const btn = e.target.closest(".btn_add_cart");
        const productId = btn.dataset.id;

        const product = data.find((p) => p.id == productId);

        addToCart(product);

        const allBtns = document.querySelectorAll(
          `.btn_add_cart[data-id="${productId}"]`,
        );

        allBtns.forEach((b) => {
          b.classList.add("active");
          b.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
        });
      }
    });
  });

// FORM SUBMIT (ORDER)

const form = document.getElementById("form_contact");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let cart = getCart();

    let items = cart.map((i) => `${i.name} (x${i.quantity})`).join(" | ");
    let total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    let count = cart.reduce((t, i) => t + i.quantity, 0);

    document.getElementById("items").value = items;
    document.getElementById("total_Price").value = total + 20;
    document.getElementById("count_Items").value = count;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    })
      .then(() => {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("cart");
        updateCart();

        form.reset();

        document.getElementById("items").value = "";
        document.getElementById("total_Price").value = "";
        document.getElementById("count_Items").value = "";
      })
      .catch(() => {
        alert("❌ Error submitting order");
      });
  });
}

updateCart();
