import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import ChatList from './components/ChatList'
import SingleChat from './components/SingleChat'
import useWindowDimensions from '../../utils/getWindowSize'

import { selectOpenChatList, selectedChat, selectMessages, selectNotification } from "./store/selectors"
import { setIsChatListOpen, selectChat, setMessages, fetchMessagesData, postMessage, getNotification, setNotification, handleSendMail, updateMessage } from "./store/actions/index"

function Chat(props) {
    const { setLoggedUser, setIsChatListOpen, selectOpenChatList, messages, setMessages, selectedChat, selectChat, curretSocketId, usersList, setUsersList, loggedUser, fetchMessagesData, getNotification, selectNotification, postMessage, setNotification, handleSendMail, updateMessage } = props;
    const [isMobile, setIsMobile] = useState(false)
    const [openChat, setOpenChat] = useState(false)
    const { width } = useWindowDimensions();

    const handleOpenChat = () => {
        if(isMobile) {
            setOpenChat(!openChat)
        }
    }

    useEffect(() => {
        if(loggedUser) getNotification(loggedUser?.user_id)
        // eslint-disable-next-line
    }, [loggedUser])

    useEffect(() => {
        fetchMessagesData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(width < 780) {
          setIsMobile(true)
        }
        else {
          setIsMobile(false)
        }
      }, [width])

    return selectOpenChatList ? 
    <div className='chat-container'>
        <ChatList openChat={openChat} handleOpenChat={handleOpenChat} updateMessage={updateMessage} setLoggedUser={setLoggedUser} loggedUser={loggedUser} usersList={usersList} setUsersList={setUsersList} selectedChat={selectedChat} onSelectChat={selectChat} messages={messages} setMessages={setMessages} selectNotification={selectNotification} setNotification={setNotification} postMessage={postMessage} />
        {selectedChat ? <SingleChat handleOpenChat={handleOpenChat} openChat={openChat} isMobile={isMobile} loggedUser={loggedUser} selectedChat={selectedChat} usersList={usersList} messages={messages} setMessages={setMessages} curretSocketId={curretSocketId} setUsersList={setUsersList} postMessage={postMessage} selectNotification={selectNotification} setNotification={setNotification} handleSendMail={handleSendMail} />: null}
    </div> 
        :
    <button className='chat-button' onClick={() => setIsChatListOpen(true)} style={{ display: !selectOpenChatList ? "flex" : "none" }}>Open Chat{selectNotification && selectNotification.map(notif => notif?.status === "sent" ? <div className='red-dot' /> : null ) }</button>
}

const mapStateToProps = createStructuredSelector({
    selectedChat: selectedChat(),
    messages: selectMessages(),
    selectOpenChatList: selectOpenChatList(),
    selectNotification: selectNotification()
})

const mapDispatchToProps = dispatch => {
    return {
        setIsChatListOpen: (isOpen) => {
            dispatch(setIsChatListOpen(isOpen))
        },
        selectChat: (chat) => {
            dispatch(selectChat(chat))
        },
        setMessages: (messages) => {
            dispatch(setMessages(messages))
        },
        postMessage: (messages) => {
            dispatch(postMessage(messages))
        },
        fetchMessagesData: (to, from) => {
            dispatch(fetchMessagesData(to, from))
        },
        getNotification: (to) => {
            dispatch(getNotification(to))
        },
        setNotification: (data) => {
            dispatch(setNotification(data))
        },
        handleSendMail: (name, email, message) => {
            dispatch(handleSendMail(name, email, message))
        },
        updateMessage: (id) => {
            dispatch(updateMessage(id))
        }
    }
  }

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default (withConnect)(Chat)