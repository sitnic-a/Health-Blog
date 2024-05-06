import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { application } from "../application";
import Modal from "react-modal";
import { openAddModal } from "./redux-toolkit/features/modalSlice";
import { createPost } from "./redux-toolkit/features/postSlice";
import {
  setSuggestedTags,
  setDisplayedSuggestedTags,
  setChosenTags,
  setPickedTags,
  getTags,
} from "./redux-toolkit/features/tagSlice";
import { TagsOnPostCreation } from "./TagsOnPostCreation";

export const AddPost = () => {
  useEffect(() => {
    dispatch(getTags());
  }, []);

  let dispatch = useDispatch();
  let { isAddOpen } = useSelector((store) => store.modal);
  let { chosenTags } = useSelector((store) => store.tag);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  let submitForm = (e) => {
    let addPostObj = {
      e,
      loggedUser,
      chosenTags,
    };
    dispatch(createPost(addPostObj));
    dispatch(openAddModal(false));
  };

  return (
    <Modal
      isOpen={isAddOpen}
      style={application.modal_style}
      appElement={document.getElementById("root")}
      onRequestClose={() => {
        dispatch(openAddModal(false));
        dispatch(setSuggestedTags([]));
        dispatch(setDisplayedSuggestedTags([]));
        dispatch(setChosenTags([]));
        dispatch(setPickedTags([]));
      }}
    >
      <form
        onSubmit={submitForm}
        id="add-post-form"
        onKeyDown={(e) => {
          e.key === "Enter" && e.preventDefault();
        }}
      >
        <div className="add-post-modal-header">
          <h2>Post</h2>
        </div>
        <div className="add-post-modal-content">
          <div className="add-post-title-container">
            <label htmlFor="title">Title</label>
            <br />
            <input
              className="add-post-title-input"
              type="text"
              id="title"
              name="title"
            />
          </div>
          <div className="add-post-content-container">
            <label htmlFor="content">Content</label>
            <br />
            <textarea
              className="add-post-content-textarea"
              name="content"
              id="content"
              rows="10"
            ></textarea>
          </div>

          <TagsOnPostCreation />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};
