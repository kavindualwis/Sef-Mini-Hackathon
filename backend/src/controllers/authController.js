const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// Generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Create or update user
    const code = generateCode();
    
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = password;
      existingUser.verificationCode = code;
      existingUser.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await existingUser.save();
    } else {
      const user = new User({
        name,
        email,
        phone,
        password,
        verificationCode: code,
        verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      });
      await user.save();
    }

    console.log(`[VERIFICATION CODE] Email: ${email} -> CODE: ${code}`);

    try {
      await sendVerificationEmail(email, code, name);
    } catch (emailErr) {
      console.error('Email sending error:', emailErr.message);
    }

    res.status(201).json({ message: 'Verification code sent to your email', email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong. Please try again.' });
  }
};

// Verify email with code
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Check code expiry
    if (user.verificationCodeExpiry < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired. Please register again.' });
    }

    // Check code match
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code. Please try again.' });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Email verified successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// Resend verification code
const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendVerificationEmail(email, code, user.name);

    res.status(200).json({ message: 'New verification code sent to your email' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first', needsVerification: true, email });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

module.exports = { register, verifyEmail, resendCode, login };
