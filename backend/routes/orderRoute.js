import express from "express";
import { placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay } from "../controllers/orderController.js";
// import {  placeOrderStripe } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
// import { verify } from "jsonwebtoken";


const orderRouter = express.Router();

// admin panel
orderRouter.post('/list',adminAuth, allOrders);
orderRouter.post('/status',adminAuth, updateStatus);    


// Payment features
orderRouter.post('/place',authUser, placeOrder);
//orderRouter.post('/stripe',authUser, placeOrderStripe);
orderRouter.post('/razorpay',authUser, placeOrderRazorpay);

// user Features
orderRouter.post('/userorders',authUser, userOrders);

//verify payment
// orderRouter.post('/verifyStripe',authUser,verifyStripe);
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay);


export default orderRouter; 