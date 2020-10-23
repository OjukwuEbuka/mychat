import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { gql, useMutation  } from '@apollo/client';

const REGISTER_USER = gql`
    mutation Register(
        $email: String!, 
        $username: String!, 
        $password: String!, 
        $confirmPassword: String!
    ){
        register(
            email: $email, 
            username: $username, 
            password: $password, 
            confirmPassword: $confirmPassword
        ){
            username
            email
            createdAt
        }
    }
`

const Register = () => {
    
    const [variables, setVariables] = useState({
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    
    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, res){
            console.log(res);
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors);
        }
    });

  const inputVal = e => {
    setVariables({...variables, [e.target.name]: e.target.value})
  }

  const submitRegisterForm = e => {
    e.preventDefault();
    // setVariables
    registerUser({ variables });
  }
  return (
    <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
            <h1 className="text-center">Register</h1>
            <Form onSubmit={submitRegisterForm}>
            <Form.Group>
                <Form.Label className={errors.email && 'text-danger'}>
                    { errors.email ??'Email Address'}
                </Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    className={ errors.email && 'is-invalid'}
                    onChange={inputVal} value={variables.email} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label className={errors.username && 'text-danger'}>
                    {errors.username ?? 'Username'}
                </Form.Label>
                <Form.Control 
                    type="text" 
                    name="username" 
                    className={ errors.username && 'is-invalid'}
                    onChange={inputVal} value={variables.username} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label className={errors.password && 'text-danger'}>
                    { errors.password ?? 'Password'}
                </Form.Label>
                <Form.Control 
                    type="password" 
                    name="password" 
                    className={ errors.password && 'is-invalid'}
                    onChange={inputVal} value={variables.password} 
                />
            </Form.Group>
            <Form.Group>
                <Form.Label className={errors.confirmPassword && 'text-danger'}>
                    { errors.confirmPassword ?? 'Confirm Password'}
                </Form.Label>
                <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    className={ errors.confirmPassword && 'is-invalid'}
                    onChange={inputVal} value={variables.confirmPassword} 
                />
            </Form.Group>
            <Button variant="success" type="submit" disabled={loading}>
                { loading ? 'Loading' : 'Register'}
            </Button>
            </Form>
        </Col>
    </Row>
  );
}

export default Register;