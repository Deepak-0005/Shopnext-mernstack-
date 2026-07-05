const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

const ensureDefaultAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            if (existingAdmin.email !== adminEmail) {
                existingAdmin.email = adminEmail;
                await existingAdmin.save();
            }
            return existingAdmin;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = await User.create({
            name: "Admin User",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            verified: true,
        });

        console.log(`Default admin created: ${adminUser.email}`);
        return adminUser;
    } catch (error) {
        console.error("Admin setup failed:", error.message);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopnext-mern");
        console.log("MongoDB connected successfully");
        await ensureDefaultAdmin();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;