import axiosClient from "../../../utils/axios"

const FETCH_MESSAGES_ENDPOINT = 'messagesList'
const POST_MESSAGES_ENDPOINT = 'messages'
const GET_NOTIFICATION_ENDPOINT = 'notification'
const SEND_MAIL_ENDOPOINT = 'sendmail'
const UPDATE_MESSAGE_ENDOPOINT = 'updateMessage'

export const getMessages = (to, from) => {
    return axiosClient.get(`http://localhost:8000/${FETCH_MESSAGES_ENDPOINT}`)
}

export const postMessages = (newMessage) => {
    return axiosClient.post(`http://localhost:8000/${POST_MESSAGES_ENDPOINT}`, {
        messages: newMessage,
    })
}

export const updateMessagesStatus = (id) => {
    return axiosClient.post(`http://localhost:8000/${UPDATE_MESSAGE_ENDOPOINT}`, {
        id: id,
    })
}

export const fetchNotification = (to) => {
    return axiosClient.get(`http://localhost:8000/${GET_NOTIFICATION_ENDPOINT}/${to}`)
}

export const sendMail = (name, email, message) => {
    return axiosClient.post(`http://localhost:8000/${SEND_MAIL_ENDOPOINT}`, {
        name: name,
        email: email,
        message: message
    })
}