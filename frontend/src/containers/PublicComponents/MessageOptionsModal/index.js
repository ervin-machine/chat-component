import React from 'react'

function MessageOptionsModal(props) {
  const { handleDeleteMessage, handleEditMessage, message } = props
  return (
    <div className='message-buttons'>
        <button className='edit-message-button' onClick={(e) => {
          handleDeleteMessage(message)
          }}>delete</button>
        <button className='edit-message-button' disabled={message.isDeleted ? true : false} onClick={() => handleEditMessage(message)}>edit</button>
    </div>
  )
}

export default MessageOptionsModal