const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const dbConnection = require('./db')
const { Mongoose } = require('mongoose')
// const mongoose = require('mongoose')
const uploadRouter = require('./routes/uploadRoute.js')
const usersRoute = require('./routes/usersRoute.js')
const cors = require("cors");



// (S)//////////////////////////////////////////
app.use(cors());
// (E)//////////////////////////////////////////
app.use(express.json())
// (S)//////////////////////////////////////////
app.use(express.static('public'));
// (E)//////////////////////////////////////////

app.use('/api/cars/', require('./routes/carsRoute'))
app.use('/api/users/', require('./routes/usersRoute'))
// app.use('/api/google/', require('./routes/googleCloud.js'))
app.use('/api/bookings/', require('./routes/bookingsRoute'))
app.use('/api/getAllUsers/', require('./routes/getAllUsersRoute.js'))



if (process.env.NODE_ENV === 'production') {

    app.use('/', express.static('client/build'))

    app.get('*', (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));

    })

}

app.get('/', (req, res) => res.send('Hello World!'))

// (S)//////////////////////////////////////////
app.use(uploadRouter)
app.use(usersRoute)
// (E)//////////////////////////////////////////


app.listen(port, () => console.log(`Node JS Server Started in Port ${port}`))