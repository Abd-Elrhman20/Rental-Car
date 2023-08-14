// /////////////////////////////////////////////////////////////////////////////////[S](check if the first range contains the second range in hours)
function compareTimeRanges(range1Start, range1End, range2Start, range2End) {
  const start1 = new Date(range1Start);
  const end1 = new Date(range1End);
  const start2 = new Date(range2Start);
  const end2 = new Date(range2End);

  // Check if there is any overlap between the two ranges
  const overlap = start1 <= end2 && start2 <= end1;

  // If there is an overlap, the ranges agree
  return overlap;
}

// Test the function
// const range1Start = "OCT 02 2023 01:00";
// const range1End = "OCT 02 2023 03:00";
// const range2Start = "OCT 02 2023 02:00";
// const range2End = "OCT 02 2023 05:00";

// const result = compareTimeRanges(range1Start, range1End, range2Start, range2End);
// console.log(result); // Output: true



// /////////////////////////////////////////////////////////////////////////////////[E](check if the first range contains the second range in hours)


const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User = require("../models/userModel.js");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51N0kYUFADvRLUPQR28uNG5eeLzpQ7MWk5k6ajhF83Ahudq59YCKI3RDBHo5BJOlj7qOlzJchmx4uO5W8PRf40X5y00DpjUQ2Up"
);



var sid = 'AC651852bf61254b008c3025bcb8529aae'
var auth_token = 'bf5d9b778d43ed05d4b9c5dfb6004f7b'
var twilio = require('twilio')(sid, auth_token);



// function to get current user phone number :====>
async function getUsers(id, carName1, from1, to1) {
  let carName = carName1;
  // console.log(carName);
  let from = from1;
  // console.log(from);
  let to = to1;
  // console.log(to);
  const users = await User.find()
  users.map((item) => {
    if (item._id == id) {
      var phoneNumber = item.phoneNumber;
      console.log(`+20${phoneNumber}`);

      // console.log(carName , from , to);
      sendSms(`+20${phoneNumber}`, carName, from, to);  // twilio sms
    }
  });
}

// function to send sms to user's phone how booked a car :====>
function sendSms(phoneNumber, carName2, from2, to2) {
  console.log(`sms number = ${phoneNumber}`);
  twilio.messages.create({
    from: '+14066306128',
    to: `${phoneNumber}`,
    body: ` you had booked a {${carName2}} successfully from ${from2} to ${to2}`,
  }).then((res) => console.log("message sent successfully")).catch((err) => console.log(err))

}





router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  console.log(req.body.totalAmount);
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: req.body.totalAmount * 100,
        currency: "USD",
        customer: customer.id,
        receipt_email: token.email
      },
      {
        idempotencyKey: uuidv4(),

      }
    );

    if (payment) {
      const car = await Car.findOne({ _id: req.body.car });
      console.log(req.body.car);

      // console.log(req.body.bookedTimeSlots.from);  // Aug 02 2023 02:00 from user
      // console.log(req.body.bookedTimeSlots.to);  // Aug 02 2023 04:00   from user 
      // console.log(car.bookedTimeSlots.map((item) => item)); // {1(from, to)} , {2(from , to)}
      
      let Disagreement = []
      car.bookedTimeSlots.map((item) => {
        return (Disagreement.push(compareTimeRanges(req.body.bookedTimeSlots.from, req.body.bookedTimeSlots.to, item.from, item.to))
        )
      });
      console.log("Disagreement ", Disagreement); // [false , false]

      if (Disagreement.includes(true)) {
        console.log("true");
        console.log("This car is already booked in this time");
        return res.status(400).json("This car is already booked in this time");
      } else {
        req.body.transactionId = payment.source.id;
        const newbooking = new Booking(req.body);
        await newbooking.save();
        car.bookedTimeSlots.push(req.body.bookedTimeSlots);

        await car.save();
        res.send("Your booking is successfull");
        getUsers(newbooking.user.toString(), car.name, req.body.bookedTimeSlots.from, req.body.bookedTimeSlots.to);
      }

    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


router.get("/getallbookings", async (req, res) => {

  try {

    const bookings = await Booking.find().populate('car')
    res.send(bookings)

  } catch (error) {
    return res.status(400).json(error);
  }

});


module.exports = router;
