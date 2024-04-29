import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./features/postSlice";
import tagReducer from "./features/tagSlice";
import modalReducer from "./features/modalSlice";
import userReducer from "./features/userSlice";
import pieReducer from "./features/pieSlice";
import filterReducer from "./features/filterSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    tag: tagReducer,
    modal: modalReducer,
    pie: pieReducer,
    filter: filterReducer,
  },
});
