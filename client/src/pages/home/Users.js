import React from 'react';
import { Col, Image } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';

import { useMessageDispatch, useMessageState } from '../../context/message';

const GET_USERS = gql`
    query getUsers{
        getUsers{
            username createdAt imageUrl
            latestMessage {
                uuid 
                from 
                to 
                content 
                createdAt
            }
        }
    }
`;

export default function Users() {
    const dispatch = useMessageDispatch();
    const { users } = useMessageState();

    const {loading, data, error} = useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: err => console.log(err)
    });

    if(error){
        //
    }
    if(data){
        console.log(data)
    }

    let usersMarkup
    if(!data || loading){
        usersMarkup = <p>Loading...</p>
    } else if(users && users.length === 0){
        usersMarkup = <p>Loading...</p>
    } else if(users && users.length > 0){
        let userClassName = "user-div d-flex justify-content-center justify-content-md-start p-3" ;
        usersMarkup = users.map(user => (
            <div 
                role="button"
                className={user.selected ?
                    (userClassName + " bg-white") :
                    userClassName
                }
                key={user.username} 
                onClick={() => dispatch({type: 'SET_SELECTED_USER', payload: user.username})}
            >
                <Image src={user.imageUrl}  className="user-image" />
                <div className="d-none d-md-block ml-2">
                    <p className="text-success">{ user.username }</p>
                    <p className="font-weight-light">
                        {user.latestMessage ? user.latestMessage.content : 'You are now connected'}
                    </p>
                </div>
            </div>
        ))
    }

    return (
        <Col className="p-0 bg-secondary" xs={2} md={4}>
            {usersMarkup}
        </Col>
    )
}