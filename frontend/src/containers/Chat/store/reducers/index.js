import produce from 'immer'
import { types } from '../constants'

export const initialState = {
    usersList: [],
    errorMessage: false,
    messages: [],
    analytics: [],
    emailData: [],
    notificationData: [],
    error: ''
}

const chatDataReducer = (state = initialState, action) => 
    produce(state, draft => {
        switch(action.type) {
            case types.OPEN_CHATLIST_REQUEST:
                draft.isLoading = true;
                break;
            case types.OPEN_CHATLIST_SUCCESS:
                draft.isLoading = false;
                draft.isChatListOpen = action.payload;
                break;
            case types.OPEN_CHATLIST_FAILURE:
                draft.isLoading = false;
                draft.errorMessage = true;
                draft.error = action.payload;
                break;
            case types.SET_MESSAGES_REQUEST:
                draft.isLoading = true;
                break;
            case types.SET_MESSAGES_SUCCESS:
                draft.isLoading = false;
                draft.messages = action.payload;
                break;
            case types.SET_MESSAGES_FAILURE:
                draft.isLoading = false;
                draft.errorMessage = true;
                draft.error = action.payload;
                break;
            case types.GET_NOTIFICATION_REQUEST:
                draft.isLoading = true;
                break;
            case types.GET_NOTIFICATION_SUCCESS:
                draft.isLoading = false;
                draft.notificationData = action.payload
                break;
            case types.GET_NOTIFICATION_FAILURE:
                draft.isLoading = false;
                draft.errorMessage = true;
                draft.error = action.payload;
                break;
            case types.SELECT_CHAT_REQUEST:
                draft.isLoading = true;
                break;
            case types.SELECT_CHAT_SUCCESS:
                draft.isLoading = false;
                draft.selectedChat = action.payload;
                break;
            case types.SELECT_CHAT_FAILURE:
                draft.isLoading = false;
                draft.errorMessage = true;
                draft.error = action.payload;
                break;
            default:
                break;
        }
    })

export default chatDataReducer