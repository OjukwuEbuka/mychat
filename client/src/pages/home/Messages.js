import React, { useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Col } from 'react-bootstrap';

import { useMessageState } from '../../context/message';

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


export default function Messages() {
    const { user: selectedUser } = useMessageState();
    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);

    useEffect(() => {
        if(selectedUser){
            getMessages({ variables: { from: selectedUser } })
        }
    }, [selectedUser]);

    if(messagesData) {
        console.log(messagesData.getMessages);
    }

    return (
        <Col xs={4}>
            {messagesData && messagesData.getMessages.length > 0 ? (
                messagesData.getMessages.map( msg => (
                    <p key={msg.uuid}>{msg.content}</p>
                ))
            ) : (<p>Messages</p>)}
        </Col>
    )
}