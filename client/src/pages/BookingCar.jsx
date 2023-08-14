import { Col, Row, Divider, DatePicker, Checkbox, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import AOS from 'aos';
import { Slider } from '@mui/material';


import 'aos/dist/aos.css'; // You can also use <link> for styles
import axios from "axios";
import { set } from "mongoose";
const { RangePicker } = DatePicker;


function BookingCar({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
    } else {
      setcar(cars.find((o) => o._id == match.params.carid));
    }
  }, [cars]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + 30 * totalHours);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values) {
    if (values != null) {
      console.log(values);
      setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
      setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));

      setTotalHours(values[1].diff(values[0], "hours"));
    } else {
      console.log("no values" + values);
    }
  }



  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };

    dispatch(bookCar(reqObj));
  }

  // ///////////////////////////////////////{3D}///////////////////////////////////////
  // getAriaValueText={valuetext}

  function carSlider(event, value) {
    document.getElementById(car.name).src = car.three_D[value];
    // console.log(event);
    // console.log(value);
  }
  function carSliderChevrolet(event, value) {
    document.getElementById(car.name).src = car.three_D.Rapid_Blue[value];
  }

  // /////////////////////////////////////////////////////////////////////////////////

  // /////////////////////////////////////////////////////////////////////////////////(Save image)

  let email = JSON.parse(localStorage.getItem("user")).email;
  const [license, setLicense] = useState("")
  const [licenseBoolen, setLicenseBoolen] = useState(false)
  const [endLicense, setEndLicense] = useState()
  const [canBook, setCanBook] = useState(false)


  const handelChange = (e) => {
    // e.preventDefault();
    const fromData = new FormData();
    fromData.append('photo', e.target.files[0]);
    axios.post(`http://localhost:5000/api/users/saveLicense/${email}`, fromData)
      .then((res) => {
        console.log(res.data);
        console.log(res.data.photo);
        setLicense(res.data.photo)
        setLicenseBoolen(true)
        // ////////////////////////////[S](get EndDate of license)
        axios.post(`http://localhost:5000/api/users/google/${email}`, { "src": res.data.photo })
          .then((res) => {
            // console.log(res.data.data);
            console.log(res.data.detections);
            setEndLicense(res.data.detections)
          })
          .catch((err) => {
            console.log(err.response.data);
          })
      })
      // ////////////////////////////[E](get EndDate of license)
      .catch((err) => {
        console.log(err.response.data);
      })
  }

  useEffect(() => {
    if (!license) {
      axios.get(`http://localhost:5000/api/users/getLicense/${email}`)
        .then((res) => {
          setLicense(res.data[0].photo)
        })
        .catch((err) => {
          console.log(err.response.data);
        })
    }
  }, [])

  if (licenseBoolen == true) {
    setTimeout(() => {
      document.querySelector(".licenseSuccess").style.display = "none"
    }
      , 5000);
  }

  useEffect(() => {
    if (endLicense) {
      console.log("endLicense2", endLicense);
      const inputDate = endLicense; // "٢٥-٠٦-۲۰۳٢"
      const convertedDate = convertDateFormat(inputDate);
      console.log(convertedDate); // 25-06-2032
      // 
      // const currentDate = "25-06-2038";
      const currentDate = getCurrentFormattedDate();
      console.log(currentDate); // today's date
      // 
      const result = compareDates(currentDate, convertedDate);
      console.log(result);

      if (result == `${currentDate} is smaller than ${convertedDate}.`) {
        axios.post(`http://localhost:5000/api/users/checkLicense/${email}`, { "isAllowed": true })
          .then((res) => {
            // console.log(res.data);
            setCanBook(true)
          })

      } else {
        axios.post(`http://localhost:5000/api/users/checkLicense/${email}`, { "isAllowed": false })
          .then((res) => {
            // console.log(res.data);
            setCanBook(false)
          })
      }
    }

  }, [endLicense]);

  useEffect(() => {
    if (canBook == false) {
      axios.get(`http://localhost:5000/api/users/getLicense/${email}`)
        .then((res) => {
          setCanBook(res.data[0].isAllowed)
        })
    }
  }, []);





  // ////////////////////////////[S](Convert endLicense to english )
  function convertDateFormat(inputDate) {
    // Regular expression to match digits in Arabic and Persian scripts
    const arabicDigitsPattern = /[\u0660-\u0669\u06F0-\u06F9]/g;

    // Replace Arabic and Persian digits with Western digits
    const westernDigits = inputDate.replace(arabicDigitsPattern, digit => {
      // Convert Arabic and Persian digits to Western digits
      const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
      const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
      const westernDigits = '0123456789';
      return westernDigits[arabicDigits.indexOf(digit)] || westernDigits[persianDigits.indexOf(digit)] || digit;
    });

    // Split the date into day, month, and year components
    const [day, month, year] = westernDigits.split('-');

    // Combine the formatted components into the final date string
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }
  // // Test the function with the given input
  // const inputDate = endLicense; // "٢٥-٠٦-۲۰۳٢"
  // const convertedDate = convertDateFormat(inputDate);
  // console.log(convertedDate); // Output: "25-06-2032"
  // ////////////////////////////[E](Convert endLicense to english )

  // ////////////////////////////[S](get current date in english )
  function getCurrentFormattedDate() {
    const currentDate = new Date();

    // Get day, month, and year components from the current date
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so we add 1
    const year = currentDate.getFullYear();

    // Combine the formatted components into the final date string
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }
  // // Test the function with the given input
  // const currentDate = getCurrentFormattedDate();
  // console.log(currentDate); // Output: "23-02-2023" (will vary based on the current date)
  // ////////////////////////////[E](get current date in english )

  // ////////////////////////////[S](compare function between {S} date and {E} date )
  function compareDates(dateStr1, dateStr2) {
    // Function to convert date strings in the format "DD-MM-YYYY" to JavaScript Date objects
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      return new Date(`${year}-${month}-${day}`);
    };

    // Convert the date strings to Date objects
    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);

    // Compare the dates using the getTime() method of Date, which returns the timestamp
    if (date1.getTime() > date2.getTime()) {
      return `${dateStr1} is bigger than ${dateStr2}.`;  // false
    } else if (date1.getTime() < date2.getTime()) {
      return `${dateStr1} is smaller than ${dateStr2}.`; // true
    } else {
      return `${dateStr1} and ${dateStr2} are the same.`; // false
    }
  }

  // // Test the function with the given dates
  // const dateStr1 = "01-01-2032";
  // const dateStr2 = "25-06-2032";
  // const result = compareDates(dateStr1, dateStr2);
  // console.log(result); // Output: "21-07-2023 is smaller than 25-06-2032."
  // ////////////////////////////[E](compare function between {S} date and {E} date )


  // /////////////////////////////////////////////////////////////////////////////////


  // /////////////////////////////////////////////////////////////////////////////////[S](get src of details for car)
  let imgbox = document.querySelector("#box .box-img");
  let close = document.getElementById("fa-times-circle");
  let expand = document.getElementById("expand");

  let currentSRC
  function getSrcOfDetails(e) {
    console.log(e.target.src);
    imgbox.style.backgroundImage = `url(${e.target.src})`;
    document.getElementById("box").style.display = "flex";
    currentSRC = e.target.src
  }

  function closeImg() {
    document.getElementById("box").style.display = "none";
  }
  function expandIMG() {
    console.log(currentSRC);
    expand.setAttribute("href", currentSRC);
  }
  // /////////////////////////////////////////////////////////////////////////////////[E](get src of details for car)



  return (<>
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center position-relative">

          <div className="col-md-6 left-part mt-3 text-start">
            {/* {license ? <img className="img-fluid w-25" src={`http://localhost:5000/driveLicense/${license}`} alt="license" /> : ""} */}
            {/* {canBook == true ? <div>now You can book a car </div> : ""} */}
            {/* {endLicense ? <p>{endLicense}</p> : ""} */}

            <div className="mb-4">
              <p style={{ fontWeight: "500", fontSize: "40px", lineHeight: "40px" }}>{car.Brand}</p>
              <p style={{ fontWeight: "700", fontSize: "40px", lineHeight: "48px", color: "orangered" }}>{car.name_Arayy}</p>
              <p style={{ fontWeight: "500", fontSize: "32px", lineHeight: "40px" }} > {car.model}</p>
            </div>

            {!license ? <div style={{ width: "fit-content" }} id="rangePicker">
              <RangePicker disabled showTime={{ format: "HH:mm" }} format="MMM DD yyyy HH:mm" onChange={selectTimeSlots} />
              <p className="licenseAlert alert alert-danger w-50 text-center p-1 mt-2 position-absolute start-50 top-0 translate-middle-x ">Upload your License to book the car</p>
              <div className="license position-relative">
                {license ? "" : <label htmlFor="license_picker" className="position-absolute start-100" style={{ transform: "translate(-160% , -230%)" }}>
                  <i htmlFor='license_picker' className="fa-solid fa-cloud-arrow-up fa-beat-fade"></i>
                  <input hidden type="file" id='license_picker' onChange={(e) => handelChange(e)} />
                </label>}
              </div>
            </div> : ""}

            {license ? <div style={{ width: "fit-content" }} id="rangePicker">
              {canBook == false ? <RangePicker disabled showTime={{ format: "HH:mm" }} format="MMM DD yyyy HH:mm" onChange={selectTimeSlots} /> : ""}
              {canBook == true ? <RangePicker showTime={{ format: "HH:mm" }} format="MMM DD yyyy HH:mm" onChange={selectTimeSlots} /> : " "}
              {license && licenseBoolen == true ? <p className="licenseSuccess alert alert-success w-50 text-center p-1 mt-2 position-absolute start-50 top-0 translate-middle-x ">Your license photo uploaded successfully</p> : ""}
            </div> : ""}

            {/* {license && canBook == true ? <div style={{ width: "fit-content" }} id="rangePicker">
              <RangePicker showTime={{ format: "HH:mm" }} format="MMM DD yyyy HH:mm" onChange={selectTimeSlots} />
              {license && licenseBoolen == true ? <p className="licenseSuccess alert alert-success w-50 text-center p-1 mt-2 position-absolute start-50 top-0 translate-middle-x ">Your license photo uploaded successfully</p> : ""}
            </div> : ""} */}

            <br />
            <button className="btn1 mt-1" onClick={() => { setShowModal(true); }}>See Booked Slots</button>

            {from && to && (
              <div>
                <p>Total Hours : <b>{totalHours}</b></p>
                <p>Rent Per Hour : <b>{car.rentPerHour}$</b></p>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setdriver(true);
                    } else {
                      setdriver(false);
                    }
                  }}>Driver Required
                </Checkbox>
                <h3>Total Amount : {totalAmount}$</h3>
                <StripeCheckout shippingAddress token={onToken} currency='USD' amount={totalAmount * 100} stripeKey="pk_test_51N0kYUFADvRLUPQRvr2JxZMTIEXYg9lNOhdut756E1HoYcpWgyrUyI2FZIGGgDPFiNNWAC2Sj5PvEZwx2Rrs865x00L6i4K3n0">
                  <button className="btn1">Book Now</button>
                </StripeCheckout>


              </div>
            )}

            <div className="mt-3 d-flex align-items-center">
              <span style={{ fontSize: "8px", fontWeight: "600", color: "gray" }}>Powerd By : </span>
              <p style={{ fontWeight: "600", fontSize: "15px", color: "orangered" }}>RENTAL</p>
            </div>

            {/* car INF */}
            <div className="d-flex justify-content-around my-5">
              <div className="car-inf-container">
                <div className="car-inf-text">{car.capacity} Seats</div>
                <div className="car-inf-description">Ideal for a family</div>
              </div>
              <div className="car-inf-container">
                <div className="car-inf-text">{car.rentPerHour}$</div>
                <div className="car-inf-description">Per Hour</div>
              </div>
              <div className="car-inf-container">
                <div className="car-inf-text">{car.fuelType}</div>
                <div className="car-inf-description">fuelType</div>
              </div>
            </div>

          </div>

          {car.name && (
            <Modal visible={showModal} closable={false} footer={false} title="Booked time slots">
              <div className="p-2">
                {car.bookedTimeSlots.map((slot, idx) => {
                  return (
                    <button key={idx} className="btn1 mt-2">
                      {slot.from} - {slot.to}
                    </button>
                  );
                })}

                <div className="text-right mt-5">
                  <button className="btn1" onClick={() => { setShowModal(false); }}>CLOSE</button>
                </div>
              </div>
            </Modal>
          )}


          <div className="col-md-6 right-part mt-3 mb-4">
            <img src={car.image} className="w-100" alt="car image" />
            {/* {car.idx ? <Slider id="slider" aria-label="Temperature" defaultValue={0} onChange={carSlider} valueLabelDisplay="auto" step={1} marks min={0} max={car.idx} /> : ""} */}
          </div>

          {car.details ? <hr /> : ""}
        </div>
        {/* //// */}

        {car.name == "Chevrolet Corvette" ? <>
          {car.three_D.Rapid_Blue ? <div className="row mt-4">
            <div className="text-start" style={{ height: "65rem" }} >
              <p style={{ fontSize: "32px", lineHeight: "40px", fontWeight: "700", letterSpacing: "1px" }}>Virtual Tour</p>
              <p className="text-muted" style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "500", letterSpacing: "1px" }}>Interactive Gallery</p>
              <img id={car.name} src={car.three_image} className="w-100" style={{ maxHeight: "65%", objectFit: "cover" }} alt="3D_Car" />
              <div className="w-50 m-auto">
                {car.idx ? <Slider id="slider" aria-label="Temperature" defaultValue={0} onChange={carSliderChevrolet} valueLabelDisplay="auto" step={1} marks min={0} max={car.idx} /> : ""}
              </div>
            </div>
            <hr />
          </div> : ""}
        </>
          :
          <>
            {car.three_D ? <div className="row mt-4">
              <div className="text-start" style={{ height: "65rem" }} >
                <p style={{ fontSize: "32px", lineHeight: "40px", fontWeight: "700", letterSpacing: "1px" }}>Virtual Tour</p>
                <p className="text-muted" style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "500", letterSpacing: "1px" }}>Interactive Gallery</p>
                <img id={car.name} src={car.three_image} className="w-100" style={{ maxHeight: "65%", objectFit: "cover" }} alt="3D_Car" />
                <div className="w-50 m-auto">
                  {car.idx ? <Slider id="slider" aria-label="Temperature" defaultValue={0} onChange={carSlider} valueLabelDisplay="auto" step={1} marks min={0} max={car.idx} /> : ""}
                </div>
              </div>
              <hr />
            </div> : ""}
          </>}


        {car.about ? <div className="row mt-4">
          <div className="text-start">
            <p style={{ fontSize: "32px", lineHeight: "40px", fontWeight: "700", letterSpacing: "1px" }}>About</p>
            <span style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "500" }} className="mx-1 text-muted">{car.model}</span>
            <span style={{ fontSize: "24px", lineHeight: "32px", fontWeight: "500" }} className="text-muted">{car.name}</span>
          </div>
          <div className="w-50 me-auto my-4">
            <p style={{ lineHeight: "1.5", textAlign: " justify" }}>{car.about}</p>
          </div>

          <hr />
        </div> : ""}

        {car.details ? <div className="row m-4">
          <div className="mb-4">
            <h2 style={{ fontSize: " 32px", lineHeight: "40px", fontWeight: " 500" }} className="text-muted mb-2">It’s all in <span style={{ color: "black", fontWeight: " 700" }}>the Details</span></h2>
            <p>View every single detail of the car in amazing quality</p>
          </div>
          <div className="Carousel">
            <div id="carouselExample" className="carousel slide">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="d-flex flex-wrap">
                    {car.details?.map((detail, idx) => idx < 12 ? <img id={idx} style={{ height: "min-content", cursor: "pointer", padding: "5px", border: "black 1px solid" }} className="img-fluid w-25" onClick={getSrcOfDetails} src={detail} alt="detail" /> : "")}
                  </div>
                </div>

                {car.name != "Chevrolet Corvette" ? <div>
                  <div className="carousel-item">
                    <div className="d-flex flex-wrap">
                      {car.details?.map((detail, idx) => idx > 12 && idx <= 24 ? <img id={idx} style={{ height: "min-content", cursor: "pointer", padding: "5px", border: "black 1px solid" }} className="img-fluid w-25" onClick={getSrcOfDetails} src={detail} alt="detail" /> : "")}
                    </div>
                  </div>
                </div> : ""}


                {car.name != "Chevrolet Corvette" ? <div>
                  <div className="carousel-item">
                    <div className="d-flex flex-wrap">
                      {car.details?.map((detail, idx) => idx > 24 && idx <= 36 ? <img id={idx} style={{ height: "min-content", cursor: "pointer", padding: "5px", border: "black 1px solid" }} className="img-fluid w-25" onClick={getSrcOfDetails} src={detail} alt="detail" /> : "")}
                    </div>
                  </div>
                </div> : ""}

                {car.name != "Chevrolet Corvette" ? <div>
                  <div className="carousel-item">
                    <div className="d-flex flex-wrap">
                      {car.details?.map((detail, idx) => idx > 36 && idx <= 48 ? <img id={idx} style={{ height: "min-content", cursor: "pointer", padding: "5px", border: "black 1px solid" }} className="img-fluid w-25" onClick={getSrcOfDetails} src={detail} alt="detail" /> : "")}
                    </div>
                  </div>
                </div> : ""}


                {car.name != "Chevrolet Colorado" ? <div>
                  {car.name != "Nissan Frontier" ? <div>
                    {car.name != "Toyota Corolla Hybrid" ? <div>
                      {car.name != "Chevrolet Corvette" ? <div className="carousel-item">
                        <div className="d-flex flex-wrap">
                          {car.details?.map((detail, idx) => idx > 48 ? <img id={idx} style={{ height: "min-content", cursor: "pointer", padding: "5px", border: "black 1px solid" }} className="img-fluid w-25" onClick={getSrcOfDetails} src={detail} alt="detail" /> : "")}
                        </div>
                      </div>
                        : ""}</div> : ""}</div> : ""}</div> : ""}

              </div>
              <button className="carousel-control-prev" style={{ zIndex: " 0" }} type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span style={{ backgroundColor: "black", borderRadius: "15%" }} className="carousel-control-prev-icon p-2" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" style={{ zIndex: " 0" }} type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span style={{ backgroundColor: "black", borderRadius: "15%" }} className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div> : ""}

        {/* open img layer */}
        <div className="row">
          <div id="box">
            <i className="far fa-times-circle position-absolute" onClick={closeImg} id="fa-times-circle"></i>
            <div className="box-img position-relative">
              {/* <i className="fas fa-arrow-left position-absolute" id="fa-arrow-left"></i> */}
              {/* <i className="fas fa-arrow-right position-absolute" id="fa-arrow-right"></i> */}
              <a className="position-absolute" onClick={expandIMG} id="expand" target="_blank"><i className="fas fa-expand"></i></a>
            </div>
          </div>

        </div>

      </div>
    </DefaultLayout>
  </>
  );
}

export default BookingCar;
