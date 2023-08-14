const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");


// do a router to get all users
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (error) {
        return res.status(400).json(error);
    }
});


module.exports = router