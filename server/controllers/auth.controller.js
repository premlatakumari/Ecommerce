import User from "../models/user.model.js";
import { validatePassword } from "../utils/validatePassword.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import { forgotPasswordEmail } from "../utils/emailTemplates.js";
import cloudinary from "../config/cloudinary.js";
import { sendToken } from "../utils/sendToken.js";
import { userResponse } from "../utils/userResponse.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Temporary storage before uploading to Cloudinary
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Register Controller
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, address, dateOfBirth } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone || !password || !dateOfBirth) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required (name, email, phone, password, dateOfBirth)' 
      });
    }

    // 2. Validate name length
    if (name.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name must be at least 3 characters long' 
      });
    }

    // 3. Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // 4. Validate phone number (10-15 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 ) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number must be 10 digits' 
      });
    }

    // 5. Parse and validate date of birth
    const parsedDateOfBirth = new Date(dateOfBirth);
    if (isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date of birth format' 
      });
    }

    // Check age (must be at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - parsedDateOfBirth.getFullYear();
    if (age < 13) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must be at least 13 years old to register' 
      });
    }

    // 6. Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      return res.status(400).json({ 
        success: false, 
        message: passwordValidationError 
      });
    }

    // 7. Check if account already exists and is verified
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return res.status(400).json({ 
        success: false, 
        message: "Account already exists with this email. Please login." 
      });
    }

    // 8. Check for existing unverified accounts
    const existingUnverifiedUser = await User.findOne({
      email,
      accountVerified: false,
    });

    // 9. Upload avatar if provided
    let avatarData = null;
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
          height: 150,
          crop: "fill",
        });
        avatarData = {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
        };
        
        // Delete temporary file after successful upload
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error('Failed to delete temporary file:', deleteError);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        
        // Delete temporary file if upload fails
        if (req.file && req.file.path) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (deleteError) {
            console.error('Failed to delete temporary file:', deleteError);
          }
        }
        
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar image. Please try again."
        });
      }
    }

    // 10. Create or update user
    let user;
    let verificationCode;

    if (existingUnverifiedUser) {
      // Update existing unverified user
      existingUnverifiedUser.name = name;
      existingUnverifiedUser.phone = phoneDigits;
      existingUnverifiedUser.password = password;
      existingUnverifiedUser.address = address || '';
      existingUnverifiedUser.dateOfBirth = parsedDateOfBirth;
      
      if (avatarData) {
        existingUnverifiedUser.avatar = avatarData;
      }
      
      verificationCode = existingUnverifiedUser.generateVerificationCode();
      await existingUnverifiedUser.save();
      user = existingUnverifiedUser;
    } else {
      // Create new user
      user = new User({ 
        name, 
        email, 
        phone: phoneDigits, 
        password, 
        address: address || '', 
        dateOfBirth: parsedDateOfBirth, 
        avatar: avatarData,
        accountVerified: false,
        status: 'active'
      });
      
      verificationCode = user.generateVerificationCode();
      await user.save();
    }

    // 11. Send verification code via email
    try {
      await sendVerificationCode(verificationCode, email);
      
      return res.status(201).json({
        success: true,
        message: existingUnverifiedUser 
          ? "Registration updated! Verification code sent to your email."
          : "Registration successful! Verification code sent to your email.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      
      return res.status(201).json({
        success: true,
        message: existingUnverifiedUser
          ? "Registration updated, but email failed. Please request a new code."
          : "Account created, but email failed. Please request a new code.",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already exists. Please use a different email." 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Server error during registration. Please try again." 
    });
  }
};

// Verify Otp Controller
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email or OTP is missing",
      });
    }

    const users = await User.find({
      email,
      accountVerified: false,
    })
      .sort({ createdAt: -1 })
      .select("+verificationCode +verificationCodeExpire");

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified",
      });
    }

    let user;
    if (users.length > 1) {
      user = users[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = users[0];
    }

    // Compare as string
    if (user.verificationCode !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({ validateModifiedOnly: true });
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found after verification",
      });
    }
    sendToken(userData, 200, "Account Verified", res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email,
      accountVerified: true,
    }).select("+password");

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password or account inactive",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found after login",
      });
    }
    sendToken(userData, 200, "Login Successfully", res);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// logout Controller
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({
      success: true,
      message: "Logged out Successfully",
    });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// getUser Controller
export const getUser = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const response = userResponse(userData);

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("getUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// forgot Password Controller
export const forgotPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      success: false,
      message: "Please enter email",
    });
  }

  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetPasswordUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  const message = forgotPasswordEmail(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "E-com Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.error("Forgot password email error:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      success: false,
      message: `Email could not be sent: ${error.message}`,
    });
  }
};

// validateResetToken Controller
export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findByResetToken(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Validate reset token error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// resetPassword Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findByResetToken(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has expired",
      });
    }

    const { newPassword, confirmNewPassword } = req.body;
    
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation are required",
      });
    }

    const passwordValidationError = validatePassword(
      newPassword,
      confirmNewPassword
    );

    if (passwordValidationError) {
      return res.status(400).json({
        success: false,
        message: passwordValidationError,
      });
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = newPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// updatePassword Controller
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    const isPasswordMatched = await user.comparePassword(currentPassword);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const passwordValidationError = validatePassword(
      newPassword,
      confirmNewPassword
    );
    if (passwordValidationError) {
      return res.status(400).json({
        success: false,
        message: passwordValidationError,
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Update password error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// resendOTP Controller
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find the most recent unverified user
    const user = await User.findOne({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No pending verification found for this email",
      });
    }

    // Generate new verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Send verification code
    try {
      await sendVerificationCode(verificationCode, email);
      return res.status(200).json({
        success: true,
        message: "Verification code resent successfully",
      });
    } catch (emailError) {
      console.error("Email sending error: ", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Resend OTP error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
