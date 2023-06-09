import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MinimizeIcon from '@mui/icons-material/Minimize';

import { selectOpenChatList } from "../../containers/Chat/store/selectors"
import { setIsChatListOpen} from "../../containers/Chat/store/actions/index"
import { onUpdateUserStatus } from '../../utils/chatLogics';
import socket from '../../socket';

import StatusModal from '../../containers/PublicComponents/StatusModal';

function Navbar(props) {
  const { selectOpenChatList, setIsChatListOpen, usersList, setUsersList, loggedUser, setLoggedUser } = props;
  const [openStatusModal, setOpenStatusModal] = useState(false)

  socket.on("update status", (status, id) => {
    let updateStatus = onUpdateUserStatus(status, id, usersList)
  
    setUsersList(updateStatus)
  });

  const handleOpenStatusModal = () => {
    setOpenStatusModal(!openStatusModal)
  }

  const handleChangeStatus = (status) => {
    handleOpenStatusModal()
    setLoggedUser(prevState => ({...prevState, status: status}))
    socket.emit("update status", status, socket.id)
  }

  return !selectOpenChatList ? null
  :
    <div className='navbar-container'>
      <div className='user-info' onClick={handleOpenStatusModal}>
        <div style={{ display: "flex", width: "200px"}}>
          <div>
            <img className='logged-user-picture' src={loggedUser?.picture} alt="" />
          </div>
          <div>
            <p className='user-name'>{loggedUser?.name}</p>
            <p className='user-status'>{loggedUser?.status}</p>
          </div>
        </div>
        <StatusModal handleChangeStatus={handleChangeStatus} openStatusModal={openStatusModal} />
      </div>
      <div className='minimize-icon' onClick={() => setIsChatListOpen(false)}>
        <MinimizeIcon />
      </div>
    </div>
}

const mapStateToProps = createStructuredSelector({
  selectOpenChatList: selectOpenChatList(),
})

const mapDispatchToProps = dispatch => {
  return {
      setIsChatListOpen: (isOpen) => {
          dispatch(setIsChatListOpen(isOpen))
      },
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default (withConnect)(Navbar)