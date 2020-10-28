import React from 'react';
import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../../context/auth';

import Users from './Users';
import Messages from './Messages';

const Home = ({history}) => {
    const dispatch = useAuthDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT'});
        // history.push('/login');
        window.location.href = '/login'
    }
    
    return (
        <>
            <Row className="bg-white justify-content-around" >
                <Link to="/login">
                    <Button variant="link">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="link">Register</Button>
                </Link>
                <Button variant="link" onClick={logout}>Logout</Button>
            </Row>
            
            <Row className="bg-white mt-4">
                <Users />
                <Messages />
            </Row>
        </>
    )
}


export default Home;