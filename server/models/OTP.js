const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
});

// a function -> send mail
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email for StudyNotion", otp);
        console.log("Email sent successfully : ", mailResponse);
    }
    catch(error){
        console.log("Error occured while sendind mails : ", error);
        throw error;
    }
} 

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);