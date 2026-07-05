const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true,min:1 },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { 
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        PostalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    paymentStatus: { type: String, enum: ["pending", "verified", "failed"], default: "pending" },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
},{ timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;