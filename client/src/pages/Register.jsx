import React, { useState } from "react";
import { Row, Col, Form, Input, Radio } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { userRegister } from "../redux/actions/userActions";
import AOS from 'aos';
import Spinner from '../components/Spinner';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import Joi from 'joi'
import e from "cors";
// ..
AOS.init()
function Register() {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.alertsReducer)

  // ////////////////////////////////////////////////////////////////////////////////////////(validation)
  const [errors, setErrors] = useState(null)

  function submitMyForm(values) {
    console.log(values);

    const schema = Joi.object({
      username: Joi.string().required().min(3).max(20),
      password: Joi.string().required().min(6).max(20),
      conPassword: Joi.string().required().valid(Joi.ref('password')),
      email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      phoneNumber: Joi.string().required().regex(/^[0-9]{11}$/).messages({ 'string.pattern.base': `Phone number must have 11 digits.` }),
      adminRole: Joi.boolean()
    })

    let resultOfValidation = schema.validate(values, { abortEarly: false })

    if (resultOfValidation.error == undefined) {
      { values.adminRole == undefined ? values.adminRole = false : values.adminRole = values.adminRole }
      dispatch(userRegister(values))
    } else {
      setErrors(resultOfValidation.error.details)
    }
  }

  function deleteError() {
    setErrors(null)
  }

  // ////////////////////////////////////////////////////////////////////////////////////////


  function checkCode(e) {
    if (e.target.value === "HTI_ADMIN") {               //// Code = HTI_ADMIN ////
      document.querySelector(".displayedAdmin").style.display = "block"
      document.querySelector(".Code").style.display = "none"
    }
  }

  return (
    <div className="login">
      {loading && (<Spinner />)}
      <Row gutter={16} className="d-flex align-items-center">
        <Col lg={16} style={{ position: "relative" }}>
          <img className='w-100' data-aos='slide-left' data-aos-duration='1500' src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80" />
          <h1 className="login-logo">Rental</h1>
        </Col>
        <Col lg={8} className="text-left p-5">

          <Form layout="vertical" className="login-form p-5" onFinish={submitMyForm}>
            <h1>Register</h1>
            <hr />
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input onChange={deleteError} />
            </Form.Item>
            {errors && errors.map((err, idx) => err.context.key == "username" ? <div key={idx} className="alert alert-danger">{err.message}</div> : "")}

            <Form.Item name='password' autoComplete='new-password' label='Password' rules={[{ required: true }]}>
              <Input type='password' onChange={deleteError} />
            </Form.Item>
            {errors && errors.map((err, idx) => err.context.key == "password" ? <div key={idx} className="alert alert-danger">{err.message}</div> : "")}

            <Form.Item name='conPassword' autoComplete='new-password' label='conPassword' rules={[{ required: true }]}>
              <Input type='password' onChange={deleteError} />
            </Form.Item>
            {errors && errors.map((err, idx) => err.context.key == "conPassword" ? <div key={idx} className="alert alert-danger">{err.message}</div> : "")}

            <Form.Item name='email' label='email' rules={[{ required: true }]}>
              <Input type='email' onChange={deleteError} />
            </Form.Item>
            {errors && errors.map((err, idx) => err.context.key == "email" ? <div key={idx} className="alert alert-danger">{err.message}</div> : "")}

            <Form.Item name='phoneNumber' label='phoneNumber' rules={[{ required: true }]}>
              <Input type='number' onChange={deleteError} />
            </Form.Item>
            {errors && errors.map((err, idx) => err.context.key == "phoneNumber" ? <div key={idx} className="alert alert-danger">{err.message}</div> : "")}
            {/* //////////////////////////////////////////////////////////////////////////////////// */}
            <div className="my-4">
              <input className="Code" onChange={checkCode} type="text" placeholder="Write Code to be admin" />

              <div className="displayedAdmin">
                <Form.Item name="adminRole" label="adminRole"
                // rules={[{ required: true }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>

                </Form.Item>
              </div>
            </div>

            {/* //////////////////////////////////////////////////////////////////////////////////// */}

            <button className="btn1 mt-2 mb-3">Register</button>
            <br />
            <Link to="/login">Click Here to Login</Link>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
