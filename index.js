import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser';
import userRouter from './routers/user.router'
import categoryRouter from './routers/category.router'
import productRouter from './routers/product.router'
import cartRouter from './routers/cart.router'
const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(express.static(__dirname))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


 
var corsOptions = {
  // origin: ['http://example.com','http://example.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

mongoose.connect('mongodb://127.0.0.1:27017/assignment')
  .then(() => console.log('Connected!'))
  .catch((err)=>console.log(err))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use('/user', userRouter)
app.use('/category',categoryRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)