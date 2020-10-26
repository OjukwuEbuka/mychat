import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAuthState } from '../../context/auth';
import moment from 'moment';

export default function Message({message}) {
    const { user } = useAuthState();
    const sent = message.from === user.username;
    const received = !sent;
    let msgClasses = "py-2 px-3 rounded-pill";
    let divClasses = "d-flex my-3";
    return (
        <OverlayTrigger 
            placement={sent ? 'left' : 'right'}
            overlay={
                <Tooltip>
                    {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
                </Tooltip>
            }
            transition={false}
        >
            <div className={
                sent ? (divClasses + " ml-auto")
                : (divClasses + " mr-auto")
                }
            >
                <div className={
                    sent ? (msgClasses + " bg-primary")
                    : (msgClasses + " bg-secondary")
                    }
                >
                    <p className={
                        sent ? "text-white"
                        : ""
                        }
                    >{message.content}</p>
                </div>
            </div>
        </OverlayTrigger>
    )
}