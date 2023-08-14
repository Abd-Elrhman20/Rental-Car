import { Col, Row, Form, Input, Radio } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import Spinner from '../components/Spinner'
import { addCar } from '../redux/actions/carsActions'

function AddCar() {

    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.alertsReducer)
    const [src, setSRC] = useState("")

    function onFinish(values) {
        values.bookedTimeSlots = []
        values.image = `http://localhost:5000/uploads/${src}`  // image input value 
        if (values.image == "http://localhost:5000/uploads/") {
            document.getElementById('hideOrShow').classList.remove('visually-hidden')
            return
        } else {
            document.getElementById('hideOrShow').classList.add('visually-hidden')
            dispatch(addCar(values))
        }
        console.log(values)
    }

    // ////////////////////////////////////////////////////////////////////////////////////////(Save image)

    const handelChange = (e) => {
        e.preventDefault();
        const fromData = new FormData();
        fromData.append('photo', e.target.files[0]);
        axios.post('http://localhost:5000/api/save', fromData)
            .then((res) => {
                console.log(res.data); // object
                let Data = [res.data.photo]; // src
                console.log("SRC = " + Data);
                setSRC(Data)
                console.log("http://localhost:5000/uploads/" + Data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    // ////////////////////////////////////////////////////////////////////////////////////////


    return (
        <DefaultLayout>
            {loading && (<Spinner />)}
            <div className='alert alert-danger w-50 m-auto my-2 visually-hidden' id='hideOrShow'>Please upload your photo first</div>
            <Row justify='center my-5'>
                <Col lg={12} sm={24} xs={24} className='p-2'>
                    <Form className='bs1 p-2 position-relative' layout='vertical' onFinish={onFinish}>
                        <h3>Add New Car</h3>
                        <hr />
                        <Form.Item name='name' label='Car name' rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        {/* <Form.Item name='image' label='Image url' rules={[{ required: true }]}>
                            <Input id='imageURL' value={src} />
                        </Form.Item> */}
                        <Form.Item name='rentPerHour' label='Rent per hour' rules={[{ required: true }]}>
                            <Input type='number' min={"50"} />
                        </Form.Item>
                        <Form.Item name='capacity' label='Capacity' rules={[{ required: true }]}>
                            <Input type='number' min={"2"} max={"8"} />
                        </Form.Item>
                        {/* <Form.Item name='fuelType' label='Fuel Type' rules={[{ required: true }]}>
                            <Input />
                        </Form.Item> */}
                        <Form.Item name='model' label='model' rules={[{ required: true }]}>
                            <Input type='number' min={"1999"} max={"2025"} defaultValue={"1999"} />
                        </Form.Item>
                        <Form.Item name='location' label='location' rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value={"Madinet_Nasr"}>Madinet Nasr</Radio>
                                <Radio value={"Masr_El-Gedida"}>Masr El-Gedida</Radio>
                                <Radio value={"El_Maadi"}>El-Maadi</Radio>
                                <Radio value={"10th_of_Ramdan_City"}>10th of Ramdan City</Radio>
                                <Radio value={"Zagazig"}>Zagazig</Radio>
                            </Radio.Group>  
                        </Form.Item>
                        <Form.Item name='fuelType' label='Fuel Type' rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value={"Petrol"}>Petrol</Radio>
                                <Radio value={"Gas"}>Gas</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name='category' label='category' rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value={"Luxury"}>Luxury</Radio>
                                <Radio value={"Trucks"}>Trucks</Radio>
                                <Radio value={"Sedans"}>Sedans</Radio>
                                <Radio value={"SUV"}>SUV</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {/* /////////////////////////////////////////////////////////////////////////////////// */}
                        {/* <img src={`http://localhost:5000/uploads/${image[0].photo}`} alt="car" /> */}
                        <div className='position-relative d-flex my-3'>
                            <p className='alert alert-danger w-50'>please upload your car's photo</p>
                            <label htmlFor="file_picker" className='position-absolute' style={{ bottom: "35%", left: "5%" }}>
                                <i htmlFor='file_picker' className="fa-solid fa-cloud-arrow-up fa-beat-fade"></i>
                                <input hidden type="file" id='file_picker' onChange={(e) => handelChange(e)} />
                            </label>
                        </div>
                        {/* /////////////////////////////////////////////////////////////////////////////////// */}

                        <div className='text-right'>
                            <button className='btn1'>ADD CAR</button>
                        </div>
                        <br />

                    </Form>






                </Col>
            </Row>

        </DefaultLayout>
    )
}

export default AddCar;
