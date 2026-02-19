import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env file in the backend directory
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : true, // Allow all origins in development
  credentials: true
}));
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()

//middleware
app.use(express.json());
app.use(cors())

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)


//-------------------deployement-----------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1, "frontend/dist")));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req,res)=>{
    res.send("API is running successfully");
  });
}

//-------------------deployement-----------------------


app.get('/user', (req, res)=>{
    res.send('user')
})
app.get('/cart', (req,res)=>{
    res.send("cart")
})
app.get('/order', (req,res)=>{
    res.send('orders')
})
app.get('/product', (req, res)=>{
    res.send('products')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})







