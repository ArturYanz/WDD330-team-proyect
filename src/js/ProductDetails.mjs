import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        this.product = await this.dataSource.findProductById(this.productId);
        // the product details are needed before rendering the HTML
        this.renderProductDetails();
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
        document
            .getElementById("add-to-cart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
    document.querySelector("#p-brand").textContent = product.Brand.Name;
    document.querySelector("#p-name").textContent = product.NameWithoutBrand;

    const productImage = document.querySelector("#p-image");
    productImage.src = product.Images.PrimaryExtraLarge;
    productImage.alt = product.NameWithoutBrand;
    const euroPrice = new Intl.NumberFormat('de-DE',
        {
            style: 'currency', currency: 'EUR',
        }).format(Number(product.FinalPrice) * 0.85);
    document.querySelector("#p-price").textContent = `${euroPrice}`;
    document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
    const colorContainer = document.querySelector("#product-colors");

    colorContainer.innerHTML = product.Colors.map(
        (color) => `
    <img
      src="${color.ColorChipImageSrc}"
      alt="${color.ColorName}"
      class="color-chip"
      data-name="${color.ColorName}"
      data-preview="${color.ColorPreviewImageSrc}"
    >
  `
    ).join("");

    const chips = document.querySelectorAll(".color-chip");

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {

            document.querySelector("#p-image").src =
                chip.dataset.preview;

            document.querySelector("#p-color").textContent =
                chip.dataset.name;

            chips.forEach((c) =>
                c.classList.remove("selected")
            );

            chip.classList.add("selected");
        });
    });
    document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple;

    document.querySelector("#add-to-cart").dataset.id = product.Id;


}



