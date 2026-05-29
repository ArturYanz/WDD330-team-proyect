import { getLocalStorage, setLocalStorage } from "./utils.mjs"


export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    };
    async init() {
        // get product details from data source
        this.product = await this.dataSource.findProductById(this.productId);

        // render product to the page
        this.renderProductDetails();

        // attach event listener AFTER rendering
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }


    renderProductDetails() {
        if (!this.product) {
            console.error("Product not found:", this.productId);
            const mainElement = document.querySelector("main");
            if (mainElement) {
              mainElement.innerHTML = "<h2>Product not found</h2>";
            }
            return;
        }

        document.querySelector("h3").textContent =
            this.product.Brand?.Name ?? "";

        document.querySelector("h2").textContent =
            this.product.NameWithoutBrand;

        const img = document.getElementById("productImage");
        img.src = this.product.Images.PrimaryLarge;
        img.alt = this.product.NameWithoutBrand;

        document.getElementById("productPrice").textContent =
            `$${this.product.FinalPrice}`;

        document.getElementById("productColor").textContent =
            this.product.Colors?.[0]?.ColorName ?? "";

        document.getElementById("productDesc").innerHTML =
            this.product.DescriptionHtmlSimple;
    }
}


    // async init() {
    //     // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    //     this.product = await this.dataSource.findProductById(this.product);

    //     // the product details are needed before rendering the HTML
    //     this.renderProductDetails();

    //     // once the HTML is rendered, add a listener to the Add to Cart button
    //     document.getElementById('addToCart')
    //         .addEventListener('click', this.addToCart.bind(this));

    //     // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.



    // }

        // renderProductDetails() {
    //     // generate and populae the HTML to display the product details
    //     const tenplate = document.querySelector("product-card")
    //     const productList = document.querySelector("product-list")

    //     products.forEach(product => {
    //         const clone = template.content.cloneNode(true);
    //         const [title, productName, img, price, color, description, addToCartBtn] = clone.querySelectorAll("h3, h2, img, p, p, p, button")

    //         title.textcontent = this.product.Brand.Name;
    //         productName.textcontent = this.product.NameWithoutBrand
    //         img.src = this.product.Image
    //         img.alt = this.product.NameWithoutBrand
    //         price.textcontent = this.product.FinalPrice
    //         color.textcontent = this.product.Colors.ColorName
    //         description.textcontent = this.product.DescriptionHtmlSimple
    //         addToCartBtn.dataset = this.productId

    //         productList.appendChild(clone);
    //     });

    // };

