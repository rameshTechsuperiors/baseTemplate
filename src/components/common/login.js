import React from "react";
import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { encodeData } from "../../helpers/auth";
import { Userlogin } from "../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

function login() {
  
  const loginInfo = {
    personal_email: "ramesh@yopmail.com",
    password: "Welcome@123",
  };

  const userData = useSelector(({ user }) => user.userData);
  const router = useRouter();
  useEffect(() => {
    if (
      userData &&
      userData.personal_email == loginInfo.personal_email &&
      userData.password == loginInfo.password
    ) {
      router.push("/dashboard");
    } 
    // else {
    //   setDetails("No User associte with this email");
    // }
  }, [userData]);

  const dispatch = useDispatch();
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [details, setDetails] = useState("");
  const { email, password } = state;
  const handleSubmit = (e) => {
    e.preventDefault();
    let encodedpayload = encodeData({
      personal_email: email,
      password: password,
    });
    let encodedata = { payload: encodedpayload };
    dispatch(Userlogin(encodedata));
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="row login-container" onChange={(e) => handleChange(e)}>
      <div className="col-md-12 d-flex justify-content-start">
        <Form.Group className=" col-md-12 d-flex justify-content-start align-items-center">
          <Form.Label className="me-5">Email:</Form.Label>
          <Form.Control type="email" name="email" required value={email} />
        </Form.Group>
      </div>
      <div className="col-md-12 d-flex justify-content-start align-items-center">
        <Form.Group className="col-md-12 d-flex justify-content-between align-items-center">
          <Form.Label className="me-4">Password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={password}
          />
        </Form.Group>
      </div>
      <div className="col-md-12 d-flex justify-content-center align-items-center">
        <Button className="w-50 btn-primary" onClick={handleSubmit}>
          Login
        </Button>
      </div>
      {details && <div>"No User associte with this email"</div>}
    </div>
  );
}

export default login;
