import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import { getAllCars } from '../redux/actions/carsActions'
import { Col, Row, Divider, DatePicker, Checkbox, Slider } from 'antd'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner';
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react';
import e from 'cors'
import $ from 'jquery'
const { RangePicker } = DatePicker

function Home() {
    const { cars } = useSelector(state => state.carsReducer)    // get cars from redux store
    const { loading } = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAllCars())
    }, [])

    useEffect(() => {

        setTotalcars(cars)

    }, [cars])



    // ///////////////////////////////////////////////////////////

    function visitBooking(carID) {
        window.location.href = `/booking/${carID}`
    }


    const [searchCarArr, setSearchCarArr] = useState([])

    // search function 
    function searchCar(value) {
        // console.log(value.includes(2021));
        $('#selectProvince').css("display", "none")
        let temp = []
        if (value != '') {
            console.log("value ", value);
            cars.map((car) => {
                if (!car.Brand) {
                } else {
                    if (car.Brand.toLowerCase().includes(value.toLowerCase())) {
                        temp.push(car)
                        setSearchCarArr(temp)
                        console.log(value);
                        console.log(car.model);
                    }
                }
                if (!car.model) {
                } else {
                    if (value.includes(car.model)) {
                        temp.push(car)
                        setSearchCarArr(temp)
                        console.log(value);
                        console.log(car.model);
                    }
                }
            })
        } else {
            setSearchCarArr([])
        }
    }

    // //////////////////////////////////////
    // function to get color 
    let selectedColor
    function selectColor(color, car) {
        console.log(color);
        selectedColor = color;
        document.getElementById("Chevrolet_Corvette").src = car.three_D[color][0];
        document.getElementsByClassName("ant-slider-track")[0].style.width = "0%"
        document.getElementsByClassName("ant-slider-handle")[0].style.left = "0%"
    }


    function carSlider(event, car, color = "Rapid_Blue") {
        document.getElementById("Chevrolet_Corvette").src = car.three_D[color][event];
        // console.log("value" + event);
        // console.log(car);
        // console.log(color);
    }

    function clearSearch() {
        document.getElementById("search").value = "";
        setSearchCarArr([])
    }

    // Search select

    function showSelect() {
        $("#selectProvince").fadeToggle(150)
        // $(".child").fadeToggle(150)
        $("#down").toggleClass("fa-sort-up")

        if (document.getElementById("down").classList.contains("fa-sort-up")) {
            document.getElementById("down").style.top = "17px"
        } else {
            document.getElementById("down").style.top = "9px"

        }
    }

    // Search select 
    function selectCity(num) {
        $(`#selectCity${num}`).fadeToggle(150)
        $(`.check${num}`).toggleClass("d-none")
        if (num == 1) {
            $('#selectCity2').css("display", "none")
        } else if (num == 2) {
            $('#selectCity1').css("display", "none")
        }

    }

    let carTemp = []
    function getCity(value) {
        console.log(value);
        cars.map((car) => car.location == value ? (carTemp.push(car), setSearchCarArr(carTemp)) : "")
        $("#selectProvince").fadeToggle(150)
    }

    // //////////////////////////////////////

    // ///////////////////////////////////////////////////////////

    return (
        <DefaultLayout>

            {loading == true && (<Spinner />)}


            <div className='container position-relative'>
                <div className="w-100 mt-3" style={{ height: "45px" }}>
                    <div className='position-absolute end-0'>
                        <div className='position-relative ms-auto' style={{ width: "fit-content" }}>
                            <input id='search' className="form me-auto ms-3 my-0 form-control" placeholder='Search by brand or model' style={{ width: "25rem", height: "40px", backgroundColor: "#fafafa", color: "#161616", border: "1px solid #e0e0e0" }} type="search" name="search" onChange={(e) => searchCar(e.target.value)} />
                            {searchCarArr.length > 0 ? <i className="fa-regular fa-circle-xmark position-absolute" style={{ top: "11px", right: "15px", cursor: "pointer" }} onClick={clearSearch} ></i> : ""}
                            {searchCarArr.length > 0 ? "" : <i id='down' className="fa-solid fa-sort-down position-absolute" style={{ cursor: "pointer", top: "9px", right: "15px" }} onClick={showSelect}></i>}

                            {/* search province (city) */}
                            <div id='selectProvince' className='ms-auto p-2 mt-2' style={{ width: "33%", backgroundColor: "#ff4500d4", color: "white", borderRadius: "10px", display: "none" }}>
                                <span className='text-muted'>Province</span>
                                <p style={{ cursor: "pointer" }} className='position-relative' onClick={() => selectCity("1")} >
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <i className="fa-solid fa-caret-left mx-1" style={{ lineHeight: "1px" }}></i>
                                        cairo
                                        <i className="fa-solid fa-check check1 ms-2 d-none"></i>
                                    </div>
                                    <div id='selectCity1' className='p-2 position-absolute' style={{ width: "130%", backgroundColor: "#ff4500d4", color: "white", borderRadius: "10px", display: "none", top: "0", right: "125px" }}>
                                        <p className='my-2 py-2 px-1 py-2 px-1' style={{ cursor: "pointer", backgroundColor: "#ffffff42", borderRadius: "50px" }} onClick={() => getCity("Madinet_Nasr")} >Madinet Nasr</p>
                                        <p className='my-2 py-2 px-1 py-2 px-1' style={{ cursor: "pointer", backgroundColor: "#ffffff42", borderRadius: "50px" }} onClick={() => getCity("Masr_El-Gedida")} >Masr El-Gedida</p>
                                        <p className='my-2 py-2 px-1 py-2 px-1' style={{ cursor: "pointer", backgroundColor: "#ffffff42", borderRadius: "50px" }} onClick={() => getCity("El_Maadi")} >El-Maadi</p>
                                    </div>
                                </p>

                                <p style={{ cursor: "pointer" }} className='position-relative' onClick={() => selectCity("2")} >
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <i className="fa-solid fa-caret-left mx-1" style={{ lineHeight: "1px" }}></i>
                                        EL_Sharqya
                                        <i className="fa-solid fa-check check2 ms-2 d-none"></i>
                                    </div>
                                    <div id='selectCity2' className='p-2 position-absolute' style={{ width: "130%", backgroundColor: "#ff4500d4", color: "white", borderRadius: "10px", display: "none", top: "0", right: "125px" }}>
                                        <p className='my-2 py-2 px-1' style={{ cursor: "pointer", backgroundColor: "#ffffff42", borderRadius: "50px" }} onClick={() => getCity("10th_of_Ramdan_City")} >10th of Ramdan City</p>
                                        <p className='my-2 py-2 px-1' style={{ cursor: "pointer", backgroundColor: "#ffffff42", borderRadius: "50px" }} onClick={() => getCity("Zagazig")}>Zagazig</p>
                                    </div>
                                </p>
                            </div>

                        </div>
                    </div >
                </div >

                {
                    searchCarArr.length > 0 ? <div className='row mt-5 d-flex justify-content-around align-items-center'>
                        {searchCarArr.map((car, idx) => {
                            return (
                                <div key={idx} className="p-2 overflow-hidden bs1 carSlider my-4 col-md-3" style={{ cursor: "pointer" }} onClick={() => { visitBooking(car._id) }}>
                                    <img src={car.image} className='carimg img-fluid d-flex justify-content-center align-items-center' alt="car image" />
                                    <div className='text-start px-2'>
                                        <span className='p-1' style={{ border: "1px solid #757575" }}>{car.model}</span>
                                        <p className='carName my-2' style={{ marginTop: "8px", fontSize: "20px", fontWeight: "700", lineHeight: "24px" }}>{car.name}</p>
                                        <p className='text-muted'>RPH {car.rentPerHour}$</p>
                                    </div>
                                </div>
                            )

                        })}
                    </div> : <>
                        <div className='row' style={{ height: "85vh" }}>
                            {/* <a rel="stylesheet" id='go' /> */}
                            <h3 style={{ fontWeight: "700", fontSize: "40px", lineHeight: "48px", marginTop: "20px" }}>The New Way to Experience Cars</h3>

                            <div className='d-flex'>
                                <div className='cars X-car'>
                                    <img width="100%" style={{ transform: "translateX(50%)" }} src="https://www.relaycars.com/_next/image?url=https%3A%2F%2Fd2ivfcfbdvj3sm.cloudfront.net%2F7fc965ab77efe6bea309b7e755f83434bb5d4a520d1e3a86%2Fstills_no_cr%2Fstills_0640_png%2FMY2020%2F14487%2F14487_st0640_118.png&w=640&q=75" alt="Left-car" />
                                </div>

                                <div className='cars' style={{ zIndex: "100" }}>
                                    <img width="100%" src="https://www.relaycars.com/_next/image?url=https%3A%2F%2Fd2ivfcfbdvj3sm.cloudfront.net%2F7fc965ab77efe6bea309b7e755f83530b6584a520d1e3a86%2Fstills_no_cr%2Fstills_0640_png%2FMY2022%2F15052%2F15052_st0640_118.png&w=640&q=75" alt="middle-car" />
                                </div>

                                <div className='cars X-car'>
                                    <img width="100%" style={{ transform: "translateX(-50%)" }} src="https://www.relaycars.com/_next/image?url=https%3A%2F%2Fd2ivfcfbdvj3sm.cloudfront.net%2F7fc965ab77efe6bea309b7e755f83532ba5c4a520d1e3a86%2Fstills_no_cr%2Fstills_0640_png%2FMY2022%2F15296%2F15296_st0640_118.png&w=640&q=75" alt="right-car" />
                                </div>
                            </div>
                        </div>
                        <hr />
                    </>
                }
            </div >


            {/* 3D colored car [] */}
            {
                searchCarArr.length > 0 ? "" : <div className='container' >
                    <div className='row my-5'>
                        <div className='m-auto text-center'>
                            <p style={{ fontSize: "32px", fontWeight: "500", lineHeight: "40px" }} className='text-muted'>Weekly Spotlight</p>
                            <p style={{ fontSize: "40px", fontWeight: "700", lineHeight: "48px" }} className=''>Chevrolet Corvette Stingray</p>
                            <p style={{ fontSize: "30px", fontWeight: "500", lineHeight: "48px" }}>2021</p>
                        </div>
                        {totalCars.map((car, idx) => {
                            return (<>
                                {car.category == 'colored' ? <div key={idx} className='coloredCar w-50 m-auto' style={{ cursor: "pointer" }} >
                                    <div className='p-2 bs1 carSlider' onClick={() => { visitBooking(car._id) }}>
                                        <img id='Chevrolet_Corvette' width="100%" key={idx} src={car.three_image} alt="colored car" />
                                    </div>
                                    <div className='w-75 m-auto'>
                                        <Slider id="slider" aria-label="Temperature" defaultValue={0} onChange={(e) => carSlider(e, car, selectedColor)} valueLabelDisplay="auto" step={1} marks min={0} max={car.idx} />
                                        <div className='d-flex justify-content-around w-50 m-auto my-4'>
                                            <div className='color rounded-5' style={{ backgroundColor: "#FCFCFC", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Arctic_White", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#000000", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Black", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#e6e614", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Accelerate_Yellow_Metallic", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#c80000", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Torch_Red", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#28AFF5", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Rapid_Blue", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#af0f23", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Red_Mist_Metallic_Tintcoat", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#005AC7", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Elkhart_Lake_Blue_Metallic", car)}></div>
                                            <div className='color rounded-5' style={{ backgroundColor: "#d8d9d4", width: "25px", height: "25px", cursor: "pointer" }} onClick={() => selectColor("Silver_Flare_Metallic", car)}></div>
                                        </div>
                                    </div>
                                </div> : ""}

                            </>
                            )
                        })}
                    </div>
                </div>
            }


            {
                searchCarArr.length > 0 ? "" : <div className='container'>
                    {/* slider for each category   */}
                    <div className='row my-5'>
                        <p className='text-start mb-4' style={{ fontSize: "32px", lineHeight: "40px", color: "#ff4500db" }}>Featured <span style={{ color: "black", fontSize: "32px", lineHeight: "40px" }}> Luxury</span></p>
                        <Swiper spaceBetween={50} slidesPerView={3} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
                            {totalCars.map((car, idx) => {
                                return (
                                    <>
                                        {car.category == 'Luxury' ? <SwiperSlide style={{ cursor: "pointer" }} SwiperSlide key={idx} onClick={() => { visitBooking(car._id) }}>
                                            <div className="p-2 bs1 carSlider">
                                                <img src={car.image} className='carimg img-fluid d-flex justify-content-center align-items-center' alt="car image" />
                                                <div className='text-start px-2'>
                                                    <span className='p-1' style={{ border: "1px solid #757575" }}>{car.model}</span>
                                                    <p className='carName my-2' style={{ marginTop: "8px", fontSize: "20px", fontWeight: "700", lineHeight: "24px" }}>{car.name}</p>
                                                    <p className='text-muted'>RPH {car.rentPerHour}$</p>
                                                </div>
                                            </div>
                                        </SwiperSlide> : ""}
                                    </>
                                )
                            }
                            )}
                        </Swiper>
                    </div>
                    <hr />
                    <br />
                    <div className='row my-5'>
                        <p className='text-start mb-4' style={{ fontSize: "32px", lineHeight: "40px", color: "#ff4500db" }}>Featured <span style={{ color: "black", fontSize: "32px", lineHeight: "40px" }}> Trucks</span></p>
                        <Swiper spaceBetween={50} slidesPerView={3} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
                            {totalCars.map((car, idx) => {
                                return (
                                    <>
                                        {car.category == 'Trucks' ? <SwiperSlide style={{ cursor: "pointer" }} SwiperSlide key={idx} onClick={() => { visitBooking(car._id) }}>
                                            <div className="p-2 bs1 carSlider">
                                                <img src={car.image} className='carimg img-fluid d-flex justify-content-center align-items-center' alt="car image" />
                                                <div className='text-start px-2'>
                                                    <span className='p-1' style={{ border: "1px solid #757575" }}>{car.model}</span>
                                                    <p className='carName my-2' style={{ marginTop: "8px", fontSize: "20px", fontWeight: "700", lineHeight: "24px" }}>{car.name}</p>
                                                    <p className='text-muted'>RPH {car.rentPerHour}$</p>
                                                </div>
                                            </div>
                                        </SwiperSlide> : ""}
                                    </>
                                )
                            }
                            )}
                        </Swiper>
                    </div>
                    <hr />
                    <br />
                    <div className='row my-5'>
                        <p className='text-start mb-4' style={{ fontSize: "32px", lineHeight: "40px", color: "#ff4500db" }}>Featured <span style={{ color: "black", fontSize: "32px", lineHeight: "40px" }}> Sedans</span></p>
                        <Swiper spaceBetween={50} slidesPerView={3} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
                            {totalCars.map((car, idx) => {
                                return (
                                    <>
                                        {car.category == 'Sedans' ? <SwiperSlide style={{ cursor: "pointer" }} SwiperSlide key={idx} onClick={() => { visitBooking(car._id) }}>
                                            <div className="p-2 bs1 carSlider">
                                                <img src={car.image} className='carimg img-fluid d-flex justify-content-center align-items-center' alt="car image" />
                                                <div className='text-start px-2'>
                                                    <span className='p-1' style={{ border: "1px solid #757575" }}>{car.model}</span>
                                                    <p className='carName my-2' style={{ marginTop: "8px", fontSize: "20px", fontWeight: "700", lineHeight: "24px" }}>{car.name}</p>
                                                    <p className='text-muted'>RPH {car.rentPerHour}$</p>
                                                </div>
                                            </div>
                                        </SwiperSlide> : ""}
                                    </>
                                )
                            }
                            )}
                        </Swiper>
                    </div>
                    <hr />
                    <br />
                    <div className='row my-5'>
                        <p className='text-start mb-4' style={{ fontSize: "32px", lineHeight: "40px", color: "#ff4500db" }}>Featured <span style={{ color: "black", fontSize: "32px", lineHeight: "40px" }}>SUV's</span></p>
                        <Swiper spaceBetween={50} slidesPerView={3} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
                            {totalCars.map((car, idx) => {
                                return (
                                    <>
                                        {car.category == 'SUV' ? <SwiperSlide style={{ cursor: "pointer" }} SwiperSlide key={idx} onClick={() => { visitBooking(car._id) }}>
                                            <div className="p-2 bs1 carSlider">
                                                <img src={car.image} className='carimg img-fluid d-flex justify-content-center align-items-center' alt="car image" />
                                                <div className='text-start px-2'>
                                                    <span className='p-1' style={{ border: "1px solid #757575" }}>{car.model}</span>
                                                    <p className='carName my-2' style={{ marginTop: "8px", fontSize: "20px", fontWeight: "700", lineHeight: "24px" }}>{car.name}</p>
                                                    <p className='text-muted'>RPH {car.rentPerHour}$</p>
                                                </div>
                                            </div>
                                        </SwiperSlide> : ""}
                                    </>
                                )
                            }
                            )}
                        </Swiper>
                    </div>
                    <hr />
                    <br />

                </div>
            }


            <div className="row position-relative blackLayerParent" style={{ backgroundColor: "orangered", height: "75px", width: "100%", cursor: "pointer" }}>
                <a className='d-flex justify-content-center align-items-center aMove' href="#go">
                    {/* <div className="blackLayer" onClick={scrollToTop} style={{ width: "100%", height: "100%", position: "absolute", top: "0", backgroundColor: "00000066" }}></div> */}
                    <div style={{ zIndex: "12" }}>
                        <span>Back to Top </span>
                        <i className="fa-solid fa-arrow-up ms-3"></i>
                    </div>
                </a>
            </div>


        </DefaultLayout >
    )
}

export default Home
