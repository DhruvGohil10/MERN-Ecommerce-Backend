import express from 'express'
import { addCategory,deleteCategory,getCategories, updateCategory } from "../controllers/category.controller";


const router = express.Router()

router.get('/get-categories',getCategories)
router.post("/add-category",addCategory)
router.delete('/delete-category/:id',deleteCategory)
router.put('/update-category/:id',updateCategory)

export default router;
