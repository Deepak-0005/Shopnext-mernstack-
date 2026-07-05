const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const Order = require("../model/Order");

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, receipt } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: "A valid amount is required" });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: receipt || crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);
        res.status(200).json({
            success: true,
            message: "Razorpay order created",
            key_id: process.env.RAZORPAY_KEY_ID,
            order
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment verification fields" });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isValid = generated_signature === razorpay_signature;

        if (isValid) {
            const filter = orderId
                ? { _id: orderId }
                : { razorpayOrderId: razorpay_order_id };

            const updatedOrder = await Order.findOneAndUpdate(
                filter,
                {
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    paymentStatus: "verified"
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                orderId: updatedOrder?._id || orderId || null
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        });
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ message: "Failed to verify payment" });
    }
};

module.exports = { createRazorpayOrder, verifyPayment };