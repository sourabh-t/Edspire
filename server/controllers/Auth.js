const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/template/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()


require("dotenv").config();

// SEND OTP
exports.sendOTP = async (req,res) => {
    try{
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User Already Exist"
            })
        }

        // genrate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated : ", otp);

        let result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // create entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
};

//Sign up
exports.signUp = async (req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password And ConfirmPassword Value doesnot match, Plz try agin"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            });
        }


        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent otp -> ", recentOtp);
        console.log("otp -> ", otp);

        if(recentOtp.length === 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }
        else if(otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        })

        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User can't be registered. Please try again",
        });
    }
};

//Login
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All fields are requires, please try again."
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered, please sign up first."
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;


            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }


            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Loggen in successfully"
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Erro while Login, Please try again."
        });
    }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}
