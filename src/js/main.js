import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const element = document.querySelector(".product-list");

const dataSource = new ProductData("tents");
const productList = new ProductList("tents", dataSource, element);

productList.init();
