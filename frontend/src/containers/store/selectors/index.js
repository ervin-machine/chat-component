import { createSelector } from 'reselect'
import { get } from 'lodash'

const selectData = state => state.chatData

const selectOpenChatList = () => createSelector(selectData, selectData => get(selectData, 'isChatListOpen'))
const selectChatData = () => createSelector(selectData, selectData => get(selectData, 'data'))
const selectedChat = () => createSelector(selectData, selectData => get(selectData, 'selectedChat'))
const selectMessages = () => createSelector(selectData, selectData => get(selectData, 'messages'))
const selectNotification = () => createSelector(selectData, selectData => get(selectData, 'notificationData'))

export { selectOpenChatList, selectChatData, selectedChat, selectMessages, selectNotification }
