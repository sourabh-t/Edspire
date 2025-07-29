const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.json({
				success: false,
				message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
			});
		}
		const token = crypto.randomBytes(20).toString("hex");

		const updatedDetails = await User.findOneAndUpdate(
			{ email: email },
			{
				token: token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);
		console.log("DETAILS", updatedDetails);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
		);

		res.json({
			success: true,
			message:
				"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
	} catch (error) {
        
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
	}
};

// exports.resetPassword = async (req, res) => {
// 	try {
// 		const { password, confirmPassword, token } = req.body;

// 		if (confirmPassword !== password) {
// 			return res.json({
// 				success: false,
// 				message: "Password and Confirm Password Does not Match",
// 			});
// 		}
// 		const userDetails = await User.findOne({ token: token });
// 		if (!userDetails) {
// 			return res.json({
// 				success: false,
// 				message: "Token is Invalid",
// 			});
// 		}
// 		if (!(userDetails.resetPasswordExpires > Date.now())) {
// 			return res.status(403).json({
// 				success: false,
// 				message: `Token is Expired, Please Regenerate Your Token`,
// 			});
// 		}
// 		const encryptedPassword = await bcrypt.hash(password, 10);
// 		await User.findOneAndUpdate(
// 			{ token: token },
// 			{ password: encryptedPassword },
// 			{ new: true }
// 		);
// 		res.json({
// 			success: true,
// 			message: `Password Reset Successful`,
// 		});
// 	} catch (error) {
// 		return res.json({
// 			error: error.message,
// 			success: false,
// 			message: `Some Error in Updating the Password`,
// 		});
// 	}
// };


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token expired. Please request a new one.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { token },
      {
        password: encryptedPassword,
        token: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};
