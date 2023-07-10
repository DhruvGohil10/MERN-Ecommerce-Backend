import ProductModel from "../models/product.model";
import { multerFunction } from "../utils/muterFunc";
import fs from 'fs'
import Cookies from "cookies";
import categoryModel from "../models/category.model";

export const addProduct = (req, res) => {
    try {
        const uploadFile = multerFunction('./uploads/product').single('image')
        uploadFile(req, res, function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                })
            }
            const { name, category, price, quantity, rating, description } = req.body

            let imagename = ""
            if (req.file != undefined) {
                imagename = req.file.filename
            }

            const proData = new ProductModel({
                name: name,
                category: category,
                price: price,
                quantity: quantity,
                rating: rating,
                description: description,
                image: imagename
            })
            proData.save();
            if (proData) {
                return res.status(201).json({
                    data: proData,
                    message: 'Successfully Created.'
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getAllProducts = async (req, res) => {
    try{
        const productsData = await ProductModel.find().populate('category');
        
        if (productsData) {
            return res.status(200).json({
                data: productsData,
                message: 'successfully got products',
                path: "http://localhost:8001/uploads"
            })
        }
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

export const getProducts = async (req, res) => {
    try {

        var cookies = new Cookies(req, res)
        console.log(JSON.parse(cookies.get('users')))
        const { q, page, size, min } = req.query;

        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(q);

        var filterdata = {}
        if (q != undefined || min != undefined) {
            filterdata = {
                $or: [
                    { name: { $regex: searchRgx, $options: "i" } },
                    { description: { $regex: searchRgx, $options: "i" } },
                    { price: { $gt: min } }

                ]
            }
        }
        const pageno = page - 1;
        const skipno = pageno * size;
        const proData = await ProductModel.find(filterdata).populate('category').limit(size).skip(skipno);
        if (proData) {
            return res.status(200).json({
                data: proData,
                message: 'Success',
                path: process.env.FILE_PATH
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getProductsByCatID = async (req, res) => {
    try {
        const categoryID = req.params.id
        const proData = await ProductModel.find({ category: categoryID }).populate('category');
        if (proData) {
            return res.status(200).json({
                data: proData,
                message: 'Success',
                path: process.env.FILE_PATH
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getProductsAgr = async (req, res) => {
    try {
        await ProductModel.aggregate([
            { "$match": { "name": "Samsung s12" } },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "categoryData"
                },
            },
            { "$unwind": "$categoryData" }
        ]).then((result) => {
            return res.status(200).json({
                data: result,
                message: 'Success',
                path: process.env.FILE_PATH
            })
        })
            .catch(err => {
                return res.status(500).json({
                    message: err.message
                })
            })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const proData = await ProductModel.find({ _id: id });

        const deletedProduct = await ProductModel.deleteOne({ _id: id })
        if (deletedProduct.acknowledged) {
            if (fs.existsSync('./uploads/' + proData.image)) {
                fs.unlinkSync('./uploads/' + proData.image)
            }
            return res.status(200).json({
                message: 'Deleted Successfully',
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}