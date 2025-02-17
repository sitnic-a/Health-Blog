import { configureStore } from '@reduxjs/toolkit'
import postReducer from './features/postSlice'
import tagReducer from './features/tagSlice'
import modalReducer from './features/modalSlice'
import userReducer from './features/userSlice'
import pieReducer from './features/pieSlice'
import filterReducer from './features/filterSlice'
import tagGradeReducer from './features/tagGradeSlice'
import shareExportReducer from './features/shareExportSlice'
import mentalExpertReducer from './features/mentalExpertSlice'
import adminReducer from './features/adminSlice'
import regularUserReducer from './features/regularUserSlice'
import emotionReducer from './features/emotionSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    tag: tagReducer,
    modal: modalReducer,
    pie: pieReducer,
    filter: filterReducer,
    tagGrade: tagGradeReducer,
    shareExport: shareExportReducer,
    mentalExpert: mentalExpertReducer,
    admin: adminReducer,
    regularUser: regularUserReducer,
    emotion: emotionReducer,
  },
})
