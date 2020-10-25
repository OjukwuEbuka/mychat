import React, { createContext, useContext, useReducer }from 'react';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return  {
                ...state,
                users: action.payload
            }
        case 'GET_USER':
            return  {
                ...state,
                user: action.payload
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

export const MessageProvider = ({children}) => {
    const [state, dispatch] = useReducer(messageReducer, { users: null, user: null })
    
    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>
                {children}
            </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    )
}

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);