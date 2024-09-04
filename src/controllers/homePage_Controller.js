import { getAllCategory } from "../models/categories.js";
import { getDiscounted, getProducts } from '../models/products.js';
import { buildNestedMenu } from "../services/nestedMenu.js";
import { getBillboard } from "../models/billboards.js";

const homePage = async (req, res, next) => {
  try {
    const categories = await getAllCategory();
    const nestedMenu = buildNestedMenu(categories);
    const discounted = await getDiscounted(5);
    const bigBillboards = await getBillboard('big');
    const mediumBillboards = await getBillboard('medium');
    const smallBillboards = await getBillboard('small');
    const amazingProducts = await getProducts(true, true, true, 5);
    //product category one
    const products_g1 = await getProducts(false, true,true, 10); // do not forget to change all this arrayyyy
    const products_g2 = await getProducts(false, true, false, 12);
    const products_g3 = await getProducts(false, true, true, 12);

    res.render("index.ejs", {
      categories: nestedMenu,
      discounted_products: discounted,
      bigBillboards: bigBillboards,
      mediumBillboards: mediumBillboards,
      smallBillboards: smallBillboards,
      amazingProducts: amazingProducts,
      products_g1: products_g1,
      products_g2: products_g2,
      products_g3: products_g3
    });
    
  } catch (error) {
    console.error(error + '  ' + error.stack);
    next(error);
  }
};



export { homePage };
