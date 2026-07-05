const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationEmail = async (user) => {
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const message = `Hello ${user.name},\n\nYour OTP for verifying your ShopNext account is ${otp}.\nIt will expire in 10 minutes.\n\nPlease do not share this OTP with anyone.`;

    await sendEmail(user.email, "ShopNext Email Verification OTP", message);
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verified: false,
        });

        await sendVerificationEmail(user);

        res.status(201).json({
            message: "Registration successful. Please verify your email with the OTP sent to your inbox.",
            email: user.email,
            userId: user._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        if (!user.otp || !user.otpExpiresAt || Date.now() > new Date(user.otpExpiresAt).getTime()) {
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.verified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verified) {
            return res.status(200).json({ message: "Email already verified" });
        }

        await sendVerificationEmail(user);
        res.status(200).json({ message: "A new OTP has been sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.verified) {
                return res.status(403).json({ message: "Please verify your email with the OTP sent to your inbox before logging in." });
            }

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getUsers, verifyEmail, resendOTP };
