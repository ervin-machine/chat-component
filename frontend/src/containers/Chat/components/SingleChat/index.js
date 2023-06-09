import React, { useState } from 'react'

import socket from '../../../../socket';
import { onMessageOption, onUserNotificationUpdate, onDeleteMessage, onEnableMessageEdit, onEditMessage } from '../../../../utils/chatLogics';

import MessagesList from '../MessagesList';

function SingleChat(props) {
      const { handleOpenChat, openChat, isMobile, loggedUser, messages, setMessages, curretSocketId, usersList, setUsersList, selectedChat, postMessage, selectNotification, setNotification, handleSendMail } = props
      const [messageContent, setMessageContent] = useState('')
      const [editMessageContent, setEditMessageContent] = useState('')
      const [typing, setTyping] = useState(false)
      
      // eslint-disable-next-line
      let editRef;

      const handleMessageContent = (e) => {
        setMessageContent(e.target.value);
        //ref = e;

        if (!typing) {
          setTyping(true)
          socket.emit("typing", {to: selectedChat.user_id});
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;

          // eslint-disable-next-line
          if(timeDiff >= timerLength && typing) {
            setTyping(false)
            socket.emit("stop typing", {to: selectedChat.user_id })
          }

        }, timerLength);
      };
    
      const onMessage = (e, content) => {
        e.preventDefault();
        setMessageContent("");

        if (selectedChat) {
          socket.emit("message received", {
            content: messageContent,
            to: selectedChat.user_id,
            id: messages.length + 1
          });

          const newMessage = [...messages,
            { id: messages.length + 1, fromUserId: curretSocketId, toUserId: selectedChat.user_id, toUser: selectedChat.name, content: messageContent, fromSelf: true, isDeleted: false, isEditMode: false, optionsOpen: false, status: "sent" }]

          setMessages(newMessage);
          postMessage(newMessage)

          if(selectedChat.status === "Offline") {
            handleSendMail(selectedChat.name, selectedChat.email, messageContent)
          }
        }

      };

      const getEditedContent = (e) => {
        setEditMessageContent(e.target.value);
        editRef = e;
      };
    
      const handleSubmitEditMessage = (e, message, content) => {
        e.preventDefault();

        if (selectedChat) {
          socket.emit("edit message", message.id, content);
          socket.emit("disable edit message", message.id)
        }

      };

      const handleOpenMessageOption = (id, data) => {
        const openMessageOption = onMessageOption(id, messages, data)

        setMessages(openMessageOption)
      }

      const handleDeleteMessage = (message) => {
        if(message.fromSelf) {
            socket.emit("delete message", message.id)
            handleOpenMessageOption()
        }
      }
    
      const handleEditMessage = (message) => {
        socket.emit("enable edit message", message.id)
        handleOpenMessageOption()
      }

      socket.on("message received", ({ content, from, id }) => {
        const userUpdate = onUserNotificationUpdate(from, usersList, true)

        let newMessages = {};
        for (let i = 0; i < usersList.length; i++) {
          const user = usersList[i];
          if (user.user_id === from) {
            newMessages = {
              id,
              fromUser: usersList[i].username,
              content,
              fromSelf: false,
              isDeleted: false,
              isEditMode: false,
              status: 'sent',
              toUserId: loggedUser?.user_id,
              fromUserId: usersList[i].user_id,
              optionsOpen: false
            };
            const messagesList = [...messages, newMessages];
            const newNotification = [...selectNotification, newMessages]
            setMessages(messagesList);
            setNotification(newNotification)
          }
        }

        setUsersList(userUpdate)
        setMessageContent("");
      });

      socket.on("stop typing", ({from}) => {
            let userUpdate = usersList.map(user => {
                if(user.user_id === from) {
                    return {...user, istyping: false}
                }
                return user
              })
              setUsersList(userUpdate)
        });

      socket.on("typing", ({from}) => {
        let userUpdate = usersList.map(user => {
            if(user.user_id === from) {
                return {...user, istyping: true}
            }
            return user
          })
          setUsersList(userUpdate)
          
    })

        socket.on("delete message", (id) => {
            const updatedMessages = onDeleteMessage(messages, id)
    
            setMessages(updatedMessages)
            postMessage(updatedMessages)
        })

        socket.on("enable edit message", (id) => {
            const updatedMessages = onEnableMessageEdit(messages, id, true)
            
            setMessages(updatedMessages)
        })

        socket.on("disable edit message", (id) => {
          const updatedMessages = onEnableMessageEdit(messages, id, false)
            
          setMessages(updatedMessages)
        })

        socket.on("edit message", (id, content) => {
            const updatedMessages = onEditMessage(messages, id, content)

            setMessages(updatedMessages)
            postMessage(updatedMessages)
        })
        
      return (
        <div className="chat-window" style={{ display: !isMobile ? "block" : (isMobile && openChat ? "block" : "none")}}>
          <div className='selected-user'>
            {isMobile ? <p onClick={handleOpenChat}>Back</p> : null}
            <p className='user-name-card'>{selectedChat.name}</p>
            <hr />
          </div>
    
          <div className="message-container">
            <MessagesList 
              messages={messages} 
              handleSubmitEditMessage={handleSubmitEditMessage} 
              getEditedContent={getEditedContent} 
              handleOpenMessageOption={handleOpenMessageOption} 
              handleEditMessage={handleEditMessage} 
              handleDeleteMessage={handleDeleteMessage} 
              selectedChat={selectedChat}
              editMessageContent={editMessageContent}
              curretSocketId={curretSocketId}
              loggedUser={loggedUser}
              usersList={usersList}
            />
          </div>
          {usersList.map(user => (
            <div className='typing-text'>
                {user.user_id === selectedChat.user_id && user.istyping ? `${user.name} is typing` : null}
            </div>
          ))}
          <form onSubmit={(e) => onMessage(e)}>
            <div className='send-message-input'>
            <input
              className="message-input"
              placeholder="Enter message to send"
              value={messageContent}
              onChange={(e) => handleMessageContent(e)}
            ></input>
            <button className='send-message' type='submit'>Send Message</button>
            </div>
            
          </form>
        </div>
      );
    };

export default SingleChat