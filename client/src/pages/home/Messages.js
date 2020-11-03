import React, { useEffect, useState, Fragment } from 'react';
import { useLazyQuery, gql, useMutation } from '@apollo/client';
import { Button, Col, Form } from 'react-bootstrap';

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
            reactions{
                uuid
                content
            }
        }
    }
`;

const SEND_MESSAGE = gql`
    mutation sendMessage($to: String!, $content: String!){
        sendMessage(to: $to, content: $content){
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
    const [content, setContent] = useState('');

    const selectedUser = users?.find( user => user.selected === true );
    const messages = selectedUser?.messages;
    const [getMessages, {loading: messagesLoading, data: messagesData}] = useLazyQuery(GET_MESSAGES);
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onError: err => console.log(err),
    });

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
    }, [messagesData]);
    
    const submitMessage = e => {
        e.preventDefault();
        if(content.trim() === '' || !selectedUser) return;
        setContent('');

        sendMessage({ variables: { to: selectedUser.username, content } })

    }

    let selectedChatMarkup;

    if(!messages && !messagesLoading) {
        selectedChatMarkup = <p className="info-text">Select a friend to begin chat.</p>;
    } else if(messagesLoading) {
        selectedChatMarkup = <p className="info-text">Loading...</p>
    } else if(messages.length > 0) {
        // console.log(messages)
        selectedChatMarkup = (messagesData && messagesData.getMessages.length > 0) || (messages.length > 0) ? (
            messages.map( (msg, index) => (
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
        selectedChatMarkup = <p className="info-text">You are now connected. Say Hi!</p>;
    }


    return (
        <Col xs={10} md={8} className="p-0">
            <div  className="messages-box d-flex flex-column-reverse p-3">
                {selectedChatMarkup}
            </div>
            <div className="px-3 py-2">
                <Form onSubmit={submitMessage} className="m-0">
                    <Form.Group className="d-flex align-items-center">
                        <Form.Control
                            type="text"
                            className="message-input p-4 bg-secondary border-0"
                            placeholder="Type a message.."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <i 
                            className="fas fa-paper-plane fa-2x text-primary ml-2" 
                            onClick={submitMessage} role="button"></i>
                    </Form.Group>
                </Form>
            </div>            
        </Col>
    )
}