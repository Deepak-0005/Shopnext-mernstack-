const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Product = require("./model/productModel");
const User = require("./model/User");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb");

    await Product.deleteMany({});
    await User.deleteMany({});

    const products = [
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
        price: 1999,
        category: "Electronics",
        stock: 25,
        imageURLs: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        numberOfReviews: 18,
      },
      {
        name: "Smart Watch",
        description: "Feature-rich smartwatch with health tracking and Bluetooth calling.",
        price: 2499,
        category: "Wearables",
        stock: 15,
        imageURLs: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
        rating: 4.2,
        numberOfReviews: 12,
      },
      {
        name: "Laptop Backpack",
        description: "Water-resistant backpack with padded laptop sleeve and multiple pockets.",
        price: 1299,
        category: "Accessories",
        stock: 40,
        imageURLs: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        numberOfReviews: 25,
      },
      {
        name: "Mechanical Keyboard",
        description: "Tactile mechanical keyboard with RGB backlighting for gamers.",
        price: 1799,
        category: "Electronics",
        stock: 20,
        imageURLs: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        numberOfReviews: 30,
      },
    ];

    const insertedProducts = await Product.insertMany(products);

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedAdminPassword,
      role: "admin",
      verified: true,
    });

    const userSeeds = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "user123",
        role: "user",
        verified: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "user123",
        role: "user",
        verified: true,
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: "user123",
        role: "user",
        verified: false,
      },
    ];

    const hashedUsers = await Promise.all(
      userSeeds.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const normalUsers = await User.insertMany(hashedUsers);

    console.log("Dummy products seeded successfully");
    console.log("Seeded products:", insertedProducts.map((p) => ({ name: p.name, price: p.price, category: p.category })));
    console.log("Admin user created:", {
      email: adminUser.email,
      password: "admin123",
      role: adminUser.role,
    });
    console.log("Dummy users created:", normalUsers.map((u) => ({ email: u.email, role: u.role })));
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
