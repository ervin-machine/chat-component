import React, { useState } from 'react'
import socket from '../../../../socket';
import { onUpdateMessageStatus, onUserNotificationUpdate, onSearchChat, onUserOption, onRemovedUser } from '../../../../utils/chatLogics';

import SearchChat from '../SearchChat';
import UserOptionsModal from '../../../PublicComponents/UserOptionsModal';
import ReportUserModal from '../../../PublicComponents/ReportUserModal';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function ChatList(props) {
    const { openChat, handleOpenChat, setLoggedUser, selectedChat, onSelectChat, usersList, messages, setMessages, setUsersList, loggedUser, updateMessage, selectNotification, setNotification } = props;
    const [searchValue, setSearchValue] = useState('');
    
    const filterRemovedUsers = onRemovedUser(usersList, loggedUser)
    const filteredChatList = onSearchChat(filterRemovedUsers, searchValue)

    socket.on("message status", (status, id) => {
        const messageUpdate = onUpdateMessageStatus(status, id, messages)
        const userUpdate = onUserNotificationUpdate(selectedChat?.user_id, usersList, false)

        setMessages(messageUpdate);
        setUsersList(userUpdate);
              
    })

      socket.on("message fetched", ({from}) => {

        for (let i = 0; i < usersList.length; i++) {
          const user = usersList[i];
          if (user.user_id === from) {
            const updatedMessages = messages.map(message => {
                return {...message, fromSelf: !message.fromSelf}
            })
            setMessages(updatedMessages);
          }
        }

      })

    const handleSelectChat = (user) => {
        onSelectChat(user)
        handleOpenChat()
        if(!loggedUser?.fetchedMessages) {
            setLoggedUser(prevState => ({...prevState, fetchedMessages: true}))
            socket.emit("message fetched", {to: user.user_id})
        }

        if(loggedUser?.status === "Active" || loggedUser?.status === "Busy") {
            socket.emit("message status", "seen", user.user_id)
        }

        // eslint-disable-next-line
        const updateNotification = selectNotification?.map(notif => {
            if(notif?.from === user.user_id && notif?.status === "sent") {
                return {...notif, status: "seen"}
            }
        })
        
        // eslint-disable-next-line
        messages.map(message => {
            if(message.fromUserId === user.user_id && message.status === "sent") {
                updateMessage(user.user_id)
            }
        })

        setNotification(updateNotification)
    }

    const handleUserOption = (id, option) => { 
        const updateUser = onUserOption(usersList, id, option, loggedUser)

        setUsersList(updateUser)
    }

    const handleOpenUserOption = (id) => {
        const updateUser = usersList.map(user => {
            if(user.user_id === id) {
                return {...user, optionOpen: !user.optionOpen}
            }

            return user
        })

        setUsersList(updateUser)
    }

    const handleReportOpen = (id) => {
        const updateUser = usersList.map(user => {
            if(user.user_id === id) {
                return {...user, reportOpen: !user.reportOpen}
            }

            return user
        })

        setUsersList(updateUser)
    }

    return (
        <div className='chat-list-container' style={{ display: openChat ? "none" : "block"}}>
            <div className='chat-list-content'>
                <SearchChat usersList={usersList} setUsersList={setUsersList} searchValue={searchValue} setSearchValue={setSearchValue} />
                {
                    filteredChatList.map(user => {
                        return user.user_id === loggedUser?.user_id ? null :
                        <div className='chat-info' key={user.key}>
                            <div style={{ display: "flex", width: "90%" }} >
                                <div>
                                    <img src={user.picture} className='user-picture' alt="" />
                                </div>
                                <div>
                                    <button className='chat-name' onClick={() => handleSelectChat(user)} key={user.user_id}>
                                        {user.name}
                                    </button>
                                    <p>{user.status}</p>
                                    {user.optionOpen ? <UserOptionsModal handleUserOption={handleUserOption} user={user} handleReportOpen={handleReportOpen} /> : null}
                                </div>
                            </div>
                            
                        {selectNotification?.map(notif => user.user_id === notif?.from && notif?.status === "sent" ? <div className='red-dot' /> : null ) }
                        <div onClick={() => handleOpenUserOption(user.user_id)}>
                            <MoreVertIcon />
                        </div>
                        {user.reportOpen ? <ReportUserModal handleReportOpen={handleReportOpen} user={user} /> : null}
                    </div>
                    })}
                
            </div>
        </div>
    )
}

export default ChatList