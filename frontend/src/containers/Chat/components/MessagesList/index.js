import React from 'react'
import MessageOptionsModal from '../../../PublicComponents/MessageOptionsModal';

import MoreVertIcon from '@mui/icons-material/MoreVert';

function MessagesList(props) {
  const {messages, handleSubmitEditMessage, getEditedContent, handleOpenMessageOption, handleEditMessage, handleDeleteMessage, selectedChat, editMessageContent } = props;
    // eslint-disable-next-line
  return messages?.map((message, index) => {
    if((!message?.fromSelf && message?.fromUserId === selectedChat.user_id )|| (message?.fromSelf && message?.fromUserId === selectedChat.user_id ))
    
      return (
        <div
          key={index}
          style={{ textAlign: "left" }}
        >
            <div className='message-info'style={{ justifyContent: "left" }} >
                <div>
                    {message?.isDeleted ? "[Message deleted]" : <p className='receiver-message'>{message?.content}</p>}
                </div>
            </div>
        </div>
      );

    if (
    (message?.fromSelf && message?.toUserId === selectedChat.user_id) || (!message?.fromSelf && message?.toUserId === selectedChat.user_id )
    )
    return message?.isEditMode ? 
    <form onSubmit={(e) => handleSubmitEditMessage(e, message, editMessageContent)} style={{ display: "flex", justifyContent: "flex-end" }}>
        <input
            className="chat-text-area"
            placeholder="Enter message to send"
            onChange={(e) => getEditedContent(e)}
        />
    </form> : 
    <div
        key={index}
        style={{ justifyContent: "right" }}
        className="message-ribbon"
    >
        <div className='message-info'style={{ justifyContent: "right" }} >
            <div>
                {message?.isDeleted ? "[Message deleted]" : <p className='sender-message'>{message?.content}</p>}
                <p className='message-status'>{message?.status}</p>
            </div>
            <div className='vert-icon' onClick={() => handleOpenMessageOption(message?.id)}>
              <MoreVertIcon />
            </div>
        </div>
        {message?.optionsOpen ? <MessageOptionsModal handleDeleteMessage={handleDeleteMessage} handleEditMessage={handleEditMessage} message={message} />: null}
    </div>
    
  });
}

export default MessagesList