const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req,res,next) => {
    try{
        // const token = req.cookies.token || req.body.token ||  req.header("Authorization").replace("Bearer ", "");
        
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        // console.log("Incoming token:", token);
        // console.log("cookies:", req.cookies);
        // console.log("body:", req.body);
        // console.log("headers:", req.headers);
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            });
        }

        //verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }
    catch(error){
        console.error("auth middleware crashed:", error);
        res.status(500).json({
            success: false,
            message:"Something went wrong while validating Token."
        });
    }
};

//isStudent 
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Students only"
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        });
    }
};

//isInstructor
exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Instructor only"
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        });
    }
};

//isAdmin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message:"This is a protected route for Admin only"
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again"
        });
    }
};