import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"

import chatReducer from "../containers/Chat/store/reducers"

export default function createReducer(history, injectReducers = {}) {
    const rootReducer = combineReducers({
        chatData: chatReducer,
        router: connectRouter(history),
        ...injectReducers
    })

    return rootReducer
}