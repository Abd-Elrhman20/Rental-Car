const mongoose = require("mongoose");

function connectDB() {

    mongoose.connect('mongodb+srv://mana2016381:mana2015@cluster0.9esgfes.mongodb.net/Rental', { useUnifiedTopology: true, useNewUrlParser: true })

    const connection = mongoose.connection

    connection.on('connected', () => {
        console.log('Mongo DB Connection Successfully')
    })

    connection.on('error', () => {
        console.log('Mongo DB Connection Error')
    })


}

connectDB()

module.exports = mongoose



// mongoDB password at 2 emails is (mana2015)