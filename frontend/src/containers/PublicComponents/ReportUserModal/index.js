import React from 'react'

function ReportUserModal(props) {
  const { handleReportOpen, user } = props
  return (
    <div className='report-user-modal'>
        <p>User report: {user.name}</p>
        <input className='report-input' placeholder='Reason for report...' />
        <div className='report-buttons'>
            <button className='report-button' onClick={() => handleReportOpen(user.user_id)}>Submit</button>
            <button className='report-button' onClick={() => handleReportOpen(user.user_id)}>Cancel</button>
        </div>
    </div>
  )
}

export default ReportUserModal