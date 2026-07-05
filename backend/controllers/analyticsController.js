const Order=require("../model/Order");
const User=require("../model/User");
const Product=require("../model/productModel");

const getAdminStats=async(req,res)=>{
    try {
        const totalUsers=await User.countDocuments({role:"user"});
        const totalOrders=await Order.countDocuments({});
        const totalProducts=await Product.countDocuments({});

        const orders=await Order.find({});



        const totalRevenueData=orders.reduce((acc,order)=>{
            return acc+order.totalAmount;
             },0);
        console.log("Revenue:", totalRevenueData);
             res.json({
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue: totalRevenueData,
            });

        }
         catch (error) {
            res.status(500).json({error:"server error"});
    }
};
module.exports={getAdminStats};