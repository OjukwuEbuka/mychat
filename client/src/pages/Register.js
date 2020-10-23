import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const Register = () => {
    
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    cpassword: ""
  })

  const inputVal = e => {
    setVariables({...variables, [e.target.name]: e.target.value})
  }

  const submitRegisterForm = e => {
    e.preventDefault();
    // setVariables
    console.log(variables);
  }
  return (
    <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
            <h1 className="text-center">Register</h1>
            <Form onSubmit={submitRegisterForm}>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" name="email" onChange={inputVal} value={variables.email} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" onChange={inputVal} value={variables.username} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" onChange={inputVal} value={variables.password} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="cpassword" onChange={inputVal} value={variables.cpassword} />
            </Form.Group>
            <Button variant="success" type="submit">
                Register
            </Button>
            </Form>
        </Col>
    </Row>
  );
}

export default Register;