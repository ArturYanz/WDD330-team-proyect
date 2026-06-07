import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import CartProductList from "./ShoppingCart.mjs";

const cartListElement = document.querySelector(".product-list")
const cartItemList = new CartProductList(cartListElement)
cartItemList.init()

loadHeaderFooter();


// renderCartContents();

function renderCartContents() {

  const cartItems = getLocalStorage("so-cart") || [];
  const groupedItems = groupCartItems(cartItems);
  const htmlItems = groupedItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");


  // Add quantity controls and remove button events after rendering cart items
  function quantityButtonsHandler() {
    const minusButton = document.querySelectorAll(".decreaseQuantity");

    const addButton = document.querySelectorAll(".addQuantity");

    minusButton.forEach((button) => {
      button.addEventListener("click", removeFromCart);
    });

    addButton.forEach((button) => {
      button.addEventListener("click", increaseQuantity);
    });

  }

  quantityButtonsHandler();
  removeFromCartHandler();
}

// Group duplicate products and display them with a quantity value
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
        ...item, quantity: 1,
      });
    }
  });
  return groupedItems;
}

function cartItemTemplate(item) {

  // Calculate total price based on product quantity
  const totalItemPrice = parseFloat(item.FinalPrice) * item.quantity;
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
    <div class=quantity-grid>
      <button data-id="${item.Id}" class="decreaseQuantity">-</button>
        qty: ${item.quantity}
      <button data-id="${item.Id}" class="addQuantity">+</button>
    </div>
  </p>
  <p class="cart-card__price">$${totalItemPrice.toFixed(2)}</p>
  
  <span  data-id="${item.Id}" class="removeFromCart btn-close">X</span>
</li>`;
  return newItem;
}

renderCartContents(); // The renderListWithTemplate from Utils is already rendering content in shppingCart.mjs


// This removes all the  products with the same id. I think it should remove one product at a time
async function removeFromCart(e) {
  const productId = e.target.dataset.id;

  const cartItems = getLocalStorage("so-cart") || [];

  const index = cartItems.findIndex(
    (item) => item.Id === productId
  );

  if (index != -1) {
    cartItems.splice(index, 1);
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function removeFromCartHandler() {
  const targets = document.querySelectorAll(".removeFromCart");
  targets.forEach((target) => {
    target.addEventListener("click", removeFromCart);
  });
}


// Increase product quantity by adding another instance of the same item to localStorage
function increaseQuantity(e) {
  const productId = e.target.dataset.id;
  const cartItems = getLocalStorage("so-cart") || [];
  const product = cartItems.find(
    (item) => item.Id === productId
  );

  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  // Re-render cart contents after ani quantity update
  renderCartContents();
}

import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
   >
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();