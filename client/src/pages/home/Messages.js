import React, { useEffect, Fragment } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Col } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './Message';

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
    const { users } = useMessageState();
    const dispatch = useMessageDispatch();
    const selectedUser = users?.find( user => user.selected === true );
    const messages = selectedUser?.messages;
    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);

    useEffect(() => {
        if(selectedUser && !selectedUser.messages){
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser]);

    useEffect(() => {
        if(messagesData){
            dispatch({ type: 'SET_USER_MESSAGES', payload: {
                username: selectedUser.username,
                messages: messagesData.getMessages
            }})
        }
    }, [messagesData])

    let selectedChatMarkup;

    if(!messages && !messagesLoading) {
        selectedChatMarkup = <p>Select a friend to begin chat.</p>;
    } else if(messagesLoading) {
        selectedChatMarkup = <p>Loading...</p>
    } else if(messages.length > 0) {
        selectedChatMarkup = messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map( (msg, index) => (
                <Fragment key={msg.uuid}>
                    <Message  message={msg} />
                    {index === messages.length - 1 && (
                        <div className="invisible">
                            <hr className="m-0" />
                        </div>
                    )}
                </Fragment>
            ))
        ) : (<p>Messages</p>)
    } else if(messages.length === 0) {
        selectedChatMarkup = <p>You are now connected. Say Hi!</p>;
    }


    return (
        <Col className="messages-box d-flex flex-column-reverse" xs={10} md={8}>
            {selectedChatMarkup}
        </Col>
    )
}