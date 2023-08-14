const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
     username: { type: String, required: true },
     password: { type: String, required: true },
     conPassword: { type: String, required: true },
     adminRole: { type: Boolean, required: false },
     email: { type: String, required: true },
     phoneNumber: { type: Number, required: true },
     photo: { type: String, required: false },
     licenseIMG: { type: String, required: false },
     isAllowed: { type: Boolean, required: false },
},
     { timestamps: true }
)

const userModel = mongoose.model('users', userSchema)

module.exports = userModel