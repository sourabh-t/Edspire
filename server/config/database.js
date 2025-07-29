const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB Connection Is Successful"))
    .catch((error) => {
        console.log("Error in DB Connection");
        console.error(error);  // kya change krna h 
        process.exit(1);
    })
}