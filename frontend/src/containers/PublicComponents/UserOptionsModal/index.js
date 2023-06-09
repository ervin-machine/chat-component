import React from 'react'

function UserOptionsModal(props) {
  const { handleUserOption, handleReportOpen, user } = props
  return (
    <div className='user-options'>
        <button className='user-action-button' onClick={() => handleUserOption(user.user_id, "mute")}>Mute</button>
        <button className='user-action-button' onClick={() => handleReportOpen(user.user_id)}>Report</button>
        <button className='user-action-button' onClick={() => handleUserOption(user.user_id, "remove")}>Remove</button>
    </div>
  )
}

export default UserOptionsModal