import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const groupedItems = groupCartItems(cartItems);

  const htmlItems = groupedItems.map((item) => cartItemTemplate(item));

  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  quantityButtonsHandler();
  removeFromCartHandler();
}

// Agrupa productos repetidos y cuenta la cantidad
function groupCartItems(cartItems) {
  const groupedItems = [];

  cartItems.forEach((item) => {
    const existingItem = groupedItems.find(
      (product) => product.Id === item.Id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      groupedItems.push({
        ...item,
        quantity: 1,
      });
    }
  });

  return groupedItems;
}

function cartItemTemplate(item) {
  const totalItemPrice =
    parseFloat(item.FinalPrice) * item.quantity;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimarySmall}"
          alt="${item.Name}"
        />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors[0].ColorName}
      </p>

      <p class="cart-card__price">
        $${totalItemPrice.toFixed(2)}
      </p>

      <div class="quantity-grid">
        <button data-id="${item.Id}" class="decreaseQuantity">−</button>

        <span class="quantity-value">${item.quantity}</span>

        <button data-id="${item.Id}" class="addQuantity">+</button>
      </div>

      <p class="cart-card__price">
        $${totalItemPrice.toFixed(2)}
      </p>

      <span data-id="${item.Id}" class="removeFromCart">
        ✕
      </span>
    </li>
  `;
}

function quantityButtonsHandler() {
  const minusButtons =
    document.querySelectorAll(".decreaseQuantity");

  const addButtons =
    document.querySelectorAll(".addQuantity");

  minusButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  addButtons.forEach((button) => {
    button.addEventListener("click", increaseQuantity);
  });
}

function removeFromCartHandler() {
  const targets =
    document.querySelectorAll(".removeFromCart");

  targets.forEach((target) => {
    target.addEventListener("click", removeFromCart);
  });
}

// Elimina UNA instancia del producto
function removeFromCart(e) {
  const productId = e.target.dataset.id;

  const cartItems =
    getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex(
    (item) => item.Id === productId
  );

  if (index !== -1) {
    cartItems.splice(index, 1);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

// Agrega UNA instancia más del producto
function increaseQuantity(e) {
  const productId = e.target.dataset.id;

  const cartItems =
    getLocalStorage("so-cart") || [];

  const product = cartItems.find(
    (item) => item.Id === productId
  );

  if (product) {
    cartItems.push(product);

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

renderCartContents();