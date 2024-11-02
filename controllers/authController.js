const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, mobile, password, role } = req.body;

  try {
    // Check if email or mobile already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or mobile number already in use' });
    }

    // Create user
    const user = await User.create({ name, email, mobile, password, role });

    // Send email for confirmation
    const message = `Hello ${user.name}, your account with email ${user.email} has been created.`;
    if (role === 'dealer') {
       await sendEmail({
        email: user.email,
        subject: 'Account Registration',
        message: `${message} You will be able to log in after admin verification.`,
      });
    } else {
      await sendEmail({
        email: user.email,
        subject: 'Account Registration',
        message: `${message} You can log in immediately.`,
      });
      
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("email",email);

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'dealer' && !user.isApproved) {
      return res.status(403).json({ message: 'Your account is not approved yet' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id },"Priyanshu", {
      expiresIn: '30d',
    });
    console.log("token",token);
const role = user.role;
    res.status(200).json({ token ,role,
      message:"User login succesfully"}
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    // Find user by either email or mobile
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token using JWT
    const resetToken = jwt.sign({ id: user._id }, "Priyanshu", {
      expiresIn: '1h',
    });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create the reset link
    const resetLink = `https://www.trustnride.in/reset-Password/${resetToken}`;

    // Email message with the reset link
    const message = `You requested a password reset. Click the link below to reset your password: ${resetLink}`;

    // Send the reset link via email (only to the user's email, not mobile)
    await sendEmail({
      email: user.email, // Email from the database
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({
      message: 'Password reset link has been sent to your registered email',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
   console.log(token);
   console.log(newPassword);
  try {
    // Verify the reset token
    const decoded = jwt.verify(token, "Priyanshu");
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// Admin approves dealer
exports.approveDealer = async (req, res) => {
  const { id } = req.params;

  try {
    const dealer = await User.findById(id);
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    dealer.isApproved = true;
    await dealer.save();

    res.status(200).json({ message: 'Dealer approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving dealer', error });
  }
};
