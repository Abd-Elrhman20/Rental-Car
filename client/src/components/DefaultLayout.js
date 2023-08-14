import React from "react";
import { Menu, Dropdown, Button, Space, Row, Col } from "antd";
import { Link } from "react-router-dom";


let adminRole = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).adminRole : false
// console.log(adminRole);


function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const menu = (
    <Menu>
      <Menu.Item>
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item>
        <a href="/userbookings">Bookings</a>
      </Menu.Item>

      {adminRole == true ? <Menu.Item> <a href="/admin">Admin</a> </Menu.Item> : <Menu.Item disabled className="message"> <a href="/admin">Admin</a> <div className="displayed">You aren't an admin</div> </Menu.Item>}

      <Menu.Item onClick={() => { localStorage.removeItem("user"); window.location.href = "/login"; }}>
        <li style={{ color: "orangered" }}>Logout</li>
      </Menu.Item>
    </Menu>
  );


  return (
    <div>
      <a rel="stylesheet" id='go' />
      <div className="header bs1">
        <Row gutter={16} justify="center">
          <Col lg={20} sm={24} xs={24}>
            <div className="d-flex justify-content-between align-items-center">
              <h1>
                <b>
                  <Link to="/" style={{ color: "orangered" }}>
                    RENTAL
                  </Link>
                </b>
              </h1>

              <Dropdown overlay={menu} placement="bottomCenter">
                <Button>{user.username}</Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>

      <div className="content">{props.children}</div>

      <div className="footer text-center ">
        <hr />

        <p>Desinged and Developed By</p>
        <p className="text-danger font-weight-bold">Rental Team</p>
      </div>
    </div>
  );
}

export default DefaultLayout;
