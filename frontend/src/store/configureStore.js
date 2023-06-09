import { createStore, applyMiddleware } from "redux"
import thunk from 'redux-thunk'

import createReducer from "../reducers"

export default function configureStore(initialState = {}, history) {
    const store = createStore(
        createReducer(history),
        initialState,
        applyMiddleware(thunk)
    )

    return store
}