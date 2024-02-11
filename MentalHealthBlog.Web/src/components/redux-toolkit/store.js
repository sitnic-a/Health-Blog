import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./features/postSlice";
import tagReducer from "./features/tagSlice";
import modalReducer from "./features/modalSlice";

export const store = configureStore({
  reducer: {
    post: postReducer,
    tag: tagReducer,
    modal: modalReducer,
  },
});
