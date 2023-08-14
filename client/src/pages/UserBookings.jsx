import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import { Col, Row } from "antd";
import Spinner from '../components/Spinner';
import moment from "moment";
import { ClassNames } from "@emotion/react";
function UserBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    dispatch(getAllBookings());
    // console.log(bookings);
    // if (bookings.length == 0) {
    //   console.log(bookings);
    //   document.getElementById("bookingUser").style.height = "100vh";
    // }else{
    //   console.log(bookings);
    //   document.getElementById("bookingUser").style.height = "auto";
    // }
  }, []);

  return (
    <DefaultLayout>
      {loading && (<Spinner />)}
      <h3 className="text-start ms-4 my-4" style={{ color: "orangered" }}>My Bookings</h3>

      <Row id="bookingUser" className="" justify="center" gutter={16}>
        <Col lg={16} sm={24}>
          {bookings.length == 0 && <h3 className="alert alert-light w-75 m-auto text-center my-4">No bookings yet</h3>}
          {/* {bookings.length == 0 && <div className="vh-100"></div>} */}
          {bookings.length >= 4 ? <div className="w-auto">
            {bookings.filter(o => o.user == user._id).map((booking) => {
              return <Row gutter={16} className="bs1 mt-3 text-left">
                <Col lg={6} sm={24}>
                  <p><b>{booking.car.name}</b></p>
                  <p>Total hours : <b>{booking.totalHours}</b></p>
                  <p>Rent per hour : <b>{booking.car.rentPerHour}</b></p>
                  <p>Total amount : <b>{booking.totalAmount}$</b></p>
                </Col>

                <Col lg={12} sm={24}>
                  <p>Transaction Id : <b>{booking.transactionId}</b></p>
                  <p>From: <b>{booking.bookedTimeSlots.from}</b></p>
                  <p>To: <b>{booking.bookedTimeSlots.to}</b></p>
                  <p>Date of booking: <b>{moment(booking.createdAt).format('MMM DD yyyy')}</b></p>
                </Col>

                <Col lg={6} sm={24} className='text-right'>
                  <img style={{ borderRadius: 5 }} src={booking.car.image} height="140" className="p-2" />
                </Col>
              </Row>;
            })}
          </div> : <div className="vh-100">

            {bookings.filter(o => o.user == user._id).map((booking) => {
              return <Row gutter={16} className="bs1 mt-3 text-left">
                <Col lg={6} sm={24}>
                  <p><b>{booking.car.name}</b></p>
                  <p>Total hours : <b>{booking.totalHours}</b></p>
                  <p>Rent per hour : <b>{booking.car.rentPerHour}</b></p>
                  <p>Total amount : <b>{booking.totalAmount}$</b></p>
                </Col>

                <Col lg={12} sm={24}>
                  <p>Transaction Id : <b>{booking.transactionId}</b></p>
                  <p>From: <b>{booking.bookedTimeSlots.from}</b></p>
                  <p>To: <b>{booking.bookedTimeSlots.to}</b></p>
                  <p>Date of booking: <b>{moment(booking.createdAt).format('MMM DD yyyy')}</b></p>
                </Col>

                <Col lg={6} sm={24} className='text-right'>
                  <img style={{ borderRadius: 5 }} src={booking.car.image} height="140" className="p-2" />
                </Col>
              </Row>;
            })}

          </div>}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default UserBookings;
