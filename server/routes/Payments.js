// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment } = require("../controllers/Payments")
const {paymentSuccessEmail} = require("../mail/template/paymentSuccessEmail")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/paymentSuccessEmail", auth, isStudent, paymentSuccessEmail);

module.exports = router 