import React from "react";
import Modal from "react-modal";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { openDeleteModal } from "./redux-toolkit/features/modalSlice";
import { deletePostById } from "./redux-toolkit/features/postSlice";
import { application } from "../application";

export const DeleteConfirmation = () => {
  let dispatch = useDispatch();
  let { isDeleteOpen } = useSelector((store) => store.modal);
  let { post } = useSelector((store) => store.post);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  let deletePostObj = {
    post: post,
    loggedUser: loggedUser,
  };

  return (
    <Modal
      isOpen={isDeleteOpen}
      style={application.modal_style}
      appElement={document.getElementById("root")}
      onRequestClose={() => dispatch(openDeleteModal(false))}
    >
      <div className="confirmation-container">
        <div className="confirmation-title">
          <h2>Are you sure you want to delete this post?</h2>
        </div>
        <div className="confirmation-actions">
          <button
            type="button"
            onClick={() => {
              dispatch(deletePostById(deletePostObj));
              //Napraviti da se reloada i pie chart kada se obrise post
              dispatch(openDeleteModal(false));
            }}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => dispatch(openDeleteModal(false))}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};
