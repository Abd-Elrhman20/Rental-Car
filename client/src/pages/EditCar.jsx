import { Col, Row, Form, Input, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { addCar, editCar, getAllCars } from "../redux/actions/carsActions";
function EditCar({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setcar] = useState();
  const [totalcars, settotalcars] = useState([]);
  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
    } else {
      settotalcars(cars);
      setcar(cars.find((o) => o._id == match.params.carid));
      console.log(car);
    }
  }, [cars]);

  function onFinish(values) {
    values._id = car._id;
    console.log(values);

    dispatch(editCar(values));
    console.log(values);
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row justify="center my-5">
        <Col lg={12} sm={24} xs={24} className='p-2'>
          {totalcars.length > 0 && (
            <Form initialValues={car} className="bs1 p-2" layout="vertical" onFinish={onFinish}>
              <h3>Edit Car</h3>
              <hr />
              <Form.Item name="name" label="Car name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item style={{ display: "none" }} name="image" label="Image url" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="rentPerHour" label="Rent per hour" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

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

              <div className="text-right">
                <button className="btn1">Edit CAR</button>
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </DefaultLayout>
  );
}

export default EditCar;
