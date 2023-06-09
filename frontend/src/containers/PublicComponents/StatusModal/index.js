import React from 'react'

function StatusModal(props) {
  const { handleChangeStatus, openStatusModal } = props;
  const statusList = ["Active", "Away", "Busy", "Offline"]

  return (
    <div className='status-modal' style={{ display: openStatusModal ? "block" : "none"}}>
        {statusList.map(status => (
          <p className='status-name' onClick={() => {handleChangeStatus(status)}}>
            {status}
          </p>
        ))}
    </div>
  )
}

export default StatusModal