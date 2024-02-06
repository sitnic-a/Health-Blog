import { configureStore } from '@reduxjs/toolkit'
import postReducer from './features/postSlice'
import modalReducer from './features/modalSlice'

export const store = configureStore({
  reducer: {
    post: postReducer,
    modal: modalReducer,
  },
})
