import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useQuery, useLazyQuery } from '@apollo/client';

import { useAuthDispatch } from '../context/auth';

const GET_USERS = gql`
    query getUsers{
        getUsers{
            username createdAt imageUrl
            latestMessage {
                uuid from to content createdAt
            }
        }
    }
`;

const GET_MESSAGES = gql`
    query getMessages($from: String!){
        getMessages(from: $from){
            uuid 
            from 
            to 
            content 
            createdAt
        }
    }
`;

const Home = ({history}) => {
    const dispatch = useAuthDispatch();
    const [selectedUser, setSelectedUser] = useState(null);

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

    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);

    useEffect(() => {
        if(selectedUser){
            getMessages({ variables: { from: selectedUser } })
        }
    }, [selectedUser]);

    if(messagesData) {
        console.log(messagesData.getMessages);
    }

    let usersMarkup
    if(!data || loading){
        usersMarkup = <p>Loading...</p>
    } else if(data.getUsers.length === 0){
        usersMarkup = <p>Loading...</p>
    } else if(data.getUsers.length > 0){
        usersMarkup = data.getUsers.map(user => (
            <div className="d-flex p-3" key={user.username} onClick={() => setSelectedUser(user.username)}>
                <Image src={user.imageUrl} roundedCircle className="mr-2" 
                    style={{ width: 50, height: 50, objectFit: 'cover'}}
                />
                <div>
                    <p className="text-success">{ user.username }</p>
                    <p className="font-weight-light">
                        {user.latestMessage ? user.latestMessage.content : 'You are now connected'}
                    </p>
                </div>
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
                <Col className="p-0 bg-secondary" xs={4}>
                    {usersMarkup}
                </Col>
                <Col xs={4}>
                    {messagesData && messagesData.getMessages.length > 0 ? (
                        messagesData.getMessages.map( msg => (
                            <p key={msg.uuid}>{msg.content}</p>
                        ))
                    ) : (<p>Messages</p>)}
                </Col>
            </Row>
        </>
    )
}


export default Home;