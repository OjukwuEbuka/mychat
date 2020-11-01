import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
    query Login($username: String!, $password: String!)
    {
        login(username: $username, password: $password){
            username
            token
        }
    }
`;

const Login = (props) => {

    const [variables, setVariables] = useState({
        username: "", password: ""
    });

    const [errors, setErrors] = useState({});

    const dispatch = useAuthDispatch();

    const [loginUser, {loading}] = useLazyQuery(LOGIN_USER, {
        onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data){
            dispatch({ type: 'LOGIN', payload: data.login });
            // props.history.push('/');
            window.location.href = '/';
        }
    });

    const inputVal = (e) => {setVariables({...variables, [e.target.name]: e.target.value})}

    const submitLoginForm = (e) => {
        e.preventDefault();
        loginUser({ variables });
    }

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
            <h1 className="text-center">Login</h1>
            <Form onSubmit={submitLoginForm}>
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
                <div>
                    <Button variant="success" type="submit" disabled={loading}>
                        { loading ? 'Loading' : 'Login'}
                    </Button>
                    <br />
                    <small>Don't have an account? <Link to="/register">Register.</Link></small>
                </div>
            </Form>
        </Col>
    </Row>
    )
}

export default Login;