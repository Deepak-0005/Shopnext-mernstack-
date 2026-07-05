const Order = require("../model/Order");

const sendEmail = require("../utils/sendEmail");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const normalizedItems = Array.isArray(items) ? items : [];
        const normalizedAddress = address || {};
        const normalizedTotal = Number(totalAmount || 0);

        if (normalizedItems.length === 0 || !normalizedTotal || !normalizedAddress.fullName || !normalizedAddress.street || !normalizedAddress.city || !(normalizedAddress.PostalCode || normalizedAddress.postalCode) || !normalizedAddress.country) {
            return res.status(400).json({ message: "Order items, total amount, and address are required" });
        }

        const resolvedPaymentId = paymentId || razorpayPaymentId || `bypass_${Date.now()}`;
        const order = await Order.create({
            user: req.user._id,
            items: normalizedItems.map((item) => ({
                productId: item.productId || item._id,
                quantity: Number(item.qty || item.quantity || 1),
                price: Number(item.price || 0),
            })),
            totalAmount: normalizedTotal,
            address: {
                fullName: normalizedAddress.fullName,
                street: normalizedAddress.street,
                city: normalizedAddress.city,
                PostalCode: normalizedAddress.PostalCode || normalizedAddress.postalCode,
                country: normalizedAddress.country,
            },
            paymentId: resolvedPaymentId,
            razorpayOrderId: razorpayOrderId || null,
            razorpayPaymentId: razorpayPaymentId || null,
            razorpaySignature: razorpaySignature || null,
            paymentStatus: razorpayPaymentId ? "verified" : "pending"
        });
        await order.save();
            const message = `Dear ${req.user.name},\n\nThank you for your order! Your order ID is ${order._id}.\n\nOrder Details:\nTotal Amount: $${totalAmount}\nShipping Address: ${address.fullName}, ${address.street}, ${address.city}, ${address.PostalCode}, ${address.country}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nYour Company Name`;




            await sendEmail(req.user.email, "Order Confirmation", message);
            res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order,
                orderId: order._id
            });
        
    } 
catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.productId", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "id name").populate("items.productId", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        const normalizedStatus = String(status || "")
            .toLowerCase()
            .trim();

        const mappedStatus = {
            pending: "pending",
            processing: "processing",
            shipped: "shipped",
            delivered: "delivered",
            cancelled: "cancelled",
            cancel: "cancelled",
        }[normalizedStatus];

        const order = await Order.findById(req.params.id);
        if (order) {
            if (!mappedStatus) {
                return res.status(400).json({ message: "Invalid order status" });
            }

            order.status = mappedStatus;
            await order.save();
            res.json({ message: "Order status updated successfully", order });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};