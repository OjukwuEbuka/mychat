import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { useAuthDispatch } from '../context/auth';

const GET_USERS = gql`
    query getUsers{
        getUsers{
            username email createdAt
        }
    }
`;

const Home = ({history}) => {
    const dispatch = useAuthDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch({ type: 'LOGOUT'});
        history.push('/login');
    }
    
    const {loading, data, error} = useQuery(GET_USERS);

    if(error){
        //
    }
    if(data){
        console.log(data)
    }

    let usersMarkup
    if(!data || loading){
        usersMarkup = <p>Loading...</p>
    } else if(data.getUsers.length === 0){
        usersMarkup = <p>Loading...</p>
    } else if(data.getUsers.length > 0){
        usersMarkup = data.getUsers.map(user => (
            <div key={user.username}>
                <p>{ user.username }</p>
            </div>
        ))
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
                <Col xs={4}>
                    {usersMarkup}
                </Col>
                <Col xs={4}>
                    <p>Messages</p>
                </Col>
            </Row>
        </>
    )
}


export default Home;