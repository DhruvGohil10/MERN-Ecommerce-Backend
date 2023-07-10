import multer from "multer";
import path from 'path'
import fs from 'fs'
import CategoryModel from "../models/category.model";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log(file)
        const ext = path.extname(file.originalname)
        const fileArr = file.originalname.split('.')
        fileArr.pop();

        const newfilename = fileArr.join('.') + '-' + Date.now() + ext;
        cb(null, newfilename)
    }
})

const upload = multer({ storage: storage })

export const addCategory = (req, res) => {
    try {
        const uploadFile = upload.single('image')
        uploadFile(req, res, function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                })
            }
            const { name, description } = req.body

            let imagename = ""
            if (req.file != undefined) {
                imagename = req.file.filename
            }

            const catData = new CategoryModel({
                name: name,
                description: description,
                image: imagename
            })
            catData.save();
            if (catData) {
                return res.status(201).json({
                    data: catData,
                    message: 'Category Successfully Created.'
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categoryData = await CategoryModel.find();
        if (categoryData) {
            return res.status(200).json({
                data: categoryData,
                message: 'Success',
                path: "http://localhost:8001/uploads"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const catData = await CategoryModel.findOne({ _id: id });

        const deletedCategory = await CategoryModel.deleteOne({ _id: id });

        if (deletedCategory.acknowledged) {
            if (fs.existsSync('./uploads/' + catData.image)) {
                fs.unlinkSync('./uploads/' + catData.image)
            }

            return res.status(200).json({
                message: 'Successfully Deleted.'
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const updateCategory = async (req, res) => {
    try {
        const uploadFile = upload.single('image')
        uploadFile(req, res, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                })
            }
            const { name, description } = req.body
            const id = req.params.id;

            const categoryData = await CategoryModel.findOne({ _id: id })

            let imagename = categoryData.image
            if (req.file != undefined) {
                imagename = req.file.filename
                if (fs.existsSync('./uploads/' + categoryData.image)) {
                    fs.unlinkSync('./uploads/' + categoryData.image)
                }
            }

            const catData = await CategoryModel.updateOne({ _id: id },
                {
                    $set: {
                        name: name,
                        description: description,
                        image: imagename
                    }
                })
            if (catData.acknowledged) {
                return res.status(200).json({
                    message: 'Successfully Updated.'
                })
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}