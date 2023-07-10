import express from 'express'
import { addProduct, deleteProduct, getProducts, getProductsAgr, getProductsByCatID, getAllProducts } from '../controllers/product.controller';
import auth from './../middlewares/auth.middleware'

const router = express.Router()

router.get('/get-products', getProducts);
router.get('/get-all-products', getAllProducts);
// router.post("/add-product", auth, addProduct);
router.post("/add-product", addProduct);
router.get('/get-products-by-category/:id',getProductsByCatID);
router.get('/get-products-agr',getProductsAgr);
router.delete('/delete-product/:id',auth,deleteProduct);

export default router;
