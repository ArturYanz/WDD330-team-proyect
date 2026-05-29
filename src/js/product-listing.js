import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();




const element = document.querySelector(".product-list");
const category = getParam("category");
const dataSource = new ProductData();
const productList = new ProductList(category, dataSource, element);

document.getElementById("pro-cat").innerHTML = category.replace("-", " ");
productList.init();
