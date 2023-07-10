import cartModel from "../models/cart.model";
import productModel from "../models/product.model"

export const addToCart = async (req, res) => {
    try {
        const { userID, productID } = req.body

        const proData = await productModel.findOne({ _id: productID });

        if (proData) {
            const cartItem = await cartModel.findOne({ product: productID, user: userID });

            if (cartItem) {
                const updateCart = await cartModel.updateOne({ _id: cartItem._id }, {
                    $set: {
                        quantity: cartItem.quantity + 1
                    }
                })
                
                if (updateCart.acknowledged) {
                    return res.status(200).json({
                        message: 'Cart Updated'
                    })
                }
            }

            const cartData = new cartModel({
                user: userID,
                product: proData._id,
                name: proData.name,
                price: proData.price,
                quantity: 1,
                image: proData.image
            })

            cartData.save()

            if (cartData) {
                return res.status(200).json({
                    data: cartData,
                    message: "Successfully added to cart",
                    path: "http://localhost:8001/uploads"
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCarts = async (req, res) => {
    try {
        const cartData = await cartModel.find()
        if (cartData) {
            return res.status(200).json({
                data: cartData,
                message: "Success",
                path: "http://localhost:8001/uploads"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCartByUserId = async (req, res) => {
    try {
        const userid = req.params.userid
        const cartItems = await cartModel.find({ user: userid })

        if (cartItems) {
            return res.status(200).json({
                data: cartItems,
                message: 'Successfully got cart items',
                path: process.env.FILE_PATH
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const id = req.params.id;
        const {type} = req.body 
       
        const cartData = await cartModel.findOne({_id:id})
        
        let quantity= cartData.quantity;

        if(type === 'increment'){
            quantity += 1
        }else{
            quantity -= 1;
        }
        if(quantity == 0){
            const deleteItem = await cartModel.deleteOne({_id:id})
            if(deleteItem.acknowledged){
                return res.status(200).json({
                    message:'Cart Item deleted.'
                })
            }
        }

        if(quantity > 10){
            return res.status(200).json({
                message:'Quantity item should not be greater than 10'
            })
        }

        const updateQty = await cartModel.updateOne({_id:id},{
            $set:{
                quantity: quantity
            }
        })

        if(updateQty.acknowledged){
            return res.status(200).json({
                message:'Quantity Updated.'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}