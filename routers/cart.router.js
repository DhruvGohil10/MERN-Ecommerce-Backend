import express from 'express'
import { addToCart, getCarts, updateQuantity, getCartByUserId } from '../controllers/cart.controller';

const router = express.Router();


router.post('/add-to-cart',addToCart);
router.get('/get-carts',getCarts);
router.put('/update-quantity/:id',updateQuantity);
router.get('/get-carts-by-userid/:userid', getCartByUserId)

export default router;