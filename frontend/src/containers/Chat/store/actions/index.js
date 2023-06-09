import { types } from "../constants"
import { getMessages, postMessages, fetchNotification, sendMail, updateMessagesStatus } from "../../services"

const setIsChatListOpenRequest = () => {
    return {
        type: types.OPEN_CHATLIST_REQUEST
    }
}

const setIsChatListOpenSuccess = (isOpen) => {
    return {
        type: types.OPEN_CHATLIST_SUCCESS,
        payload: isOpen
    }
}

const setIsChatListOpenFailure = () => {
    return {
        type: types.OPEN_CHATLIST_FAILURE
    }
}

const setMessagesRequest = () => {
    return {
        type: types.SET_MESSAGES_REQUEST
    }
}

const setMessagesSuccess = (messages) => {
    return {
        type: types.SET_MESSAGES_SUCCESS,
        payload: messages
    }
}

const setMessagesFailure = (err) => {
    return {
        type: types.SET_MESSAGES_FAILURE,
        payload: err
    }
}

const getNotificationRequest = () => {
    return {
        type: types.GET_NOTIFICATION_REQUEST
    }
}

const getNotificationSuccess = (to) => {
    return {
        type: types.GET_NOTIFICATION_SUCCESS,
        payload: to
    }
}

const getNotificationFailure = (err) => {
    return {
        type: types.GET_NOTIFICATION_FAILURE,
        payload: err
    }
}

const selectChatRequest = () => {
    return {
        type: types.SELECT_CHAT_REQUEST
    }
}

const selectChatSuccess = (chat) => {
    return {
        type: types.SELECT_CHAT_SUCCESS,
        payload: chat
    }
}

const selectChatFailure = () => {
    return {
        type: types.SELECT_CHAT_FAILURE
    }
}

export const setIsChatListOpen = (isOpen) => {
    return (dispatch) => {
        dispatch(setIsChatListOpenRequest())
        try {
            dispatch(setIsChatListOpenSuccess(isOpen))
        } catch(err) {
            dispatch(setIsChatListOpenFailure(err))
        }
    }
}

export const setMessages = (messages) => {
    return async (dispatch) => {
        dispatch(setMessagesRequest())
        try {
            dispatch(setMessagesSuccess(messages))
        } catch(err) {
            dispatch(setMessagesFailure(err))
        }
    }
}

export const getNotification = (to) => {
    return async (dispatch) => {
        dispatch(getNotificationRequest())
        try {
            let data = await fetchNotification(to)
            dispatch(getNotificationSuccess(data))
        } catch(err) {
            dispatch(getNotificationFailure(err))
        }
    }
}

export const setNotification = (data) => {
    return async (dispatch) => {
        dispatch(getNotificationRequest())
        try {
            dispatch(getNotificationSuccess(data))
        } catch(err) {
            dispatch(getNotificationFailure(err))
        }
    }
}

export const postMessage = (messages) => {
    return async (dispatch) => {
        dispatch(setMessagesRequest())
        try {
            await postMessages(messages);
            setMessagesSuccess();
        } catch(err) {
            dispatch(setMessagesFailure(err))
        }
    }
}

export const fetchMessagesData = (to, from) => {
    return async (dispatch) => {
        dispatch(setMessagesRequest())
        try {
            let messages = await getMessages(to, from)
            dispatch(setMessagesSuccess(messages))
        } catch(err) {
            dispatch(setMessagesFailure(err))
        }
    }
}

export const selectChat = (chat) => {
    return async (dispatch) => {
        dispatch(selectChatRequest())
        try {
            dispatch(selectChatSuccess(chat))
        } catch(err) {
            dispatch(selectChatFailure(err))
        }
    }
}

export const handleSendMail = (name, email, message) => {
    return async (dispatch) => {
        try {
            await dispatch(sendMail(name, email, message));
        } catch(err) {
            console.log(err)
        }
    }
}


export const updateMessage = (id) => {
    return async (dispatch) => {
        try {
            await dispatch(updateMessagesStatus(id));
        } catch(err) {
            console.log(err)
        }
    }
}