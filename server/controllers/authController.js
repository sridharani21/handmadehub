const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// In-memory OTP store: { email: { otp, expiry } }
const otpStore = {};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Handmade With Love 🌸" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🌸 Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff8f2; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #e91e8c; font-size: 2rem;">🌸</h1>
          <h2 style="color: #5c3d2e;">Password Reset</h2>
        </div>
        <p style="color: #8b6a5a;">Hi there! You requested to reset your password.</p>
        <div style="background: white; border: 2px solid #f9a8c9; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #8b6a5a; margin: 0 0 8px;">Your OTP is:</p>
          <h1 style="font-size: 2.5rem; letter-spacing: 10px; color: #e91e8c; margin: 0;">${otp}</h1>
          <p style="color: #8b6a5a; font-size: 0.85rem; margin: 12px 0 0;">Valid for 10 minutes only</p>
        </div>
        <p style="color: #8b6a5a; font-size: 0.85rem;">If you didn't request this, please ignore this email.</p>
        <p style="color: #e91e8c; font-weight: bold; margin-top: 24px;">Handmade With Love 🌸</p>
      </div>
    `,
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBlocked)
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    res.json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    if (idx === -1) user.wishlist.push(pid);
    else user.wishlist.splice(idx, 1);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Step 1: Send OTP to email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiry: Date.now() + 10 * 60 * 1000 }; // 10 min

    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Check email settings.' });
  }
};

// Step 2: Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record)
    return res.status(400).json({ message: 'No OTP requested for this email' });
  if (Date.now() > record.expiry)
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  if (record.otp !== otp)
    return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

  // OTP valid — give a short-lived reset token
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  delete otpStore[email];
  res.json({ message: 'OTP verified', resetToken });
};

// Step 3: Reset password using reset token
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successfully! You can now login.' });
  } catch (err) {
    res.status(400).json({ message: 'Reset link expired. Please start again.' });
  }
};

module.exports = {
  register, login, getProfile, updateProfile,
  toggleWishlist, getWishlist,
  forgotPassword, verifyOTP, resetPassword,
};
