import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { openDeleteModal } from "./redux-toolkit/features/modalSlice";
import {
  setIsSharingExporting,
  setPost,
} from "./redux-toolkit/features/postSlice";

import {
  formatDateToString,
  getSelectedPosts,
} from "./utils/helper-methods/methods";
import { PostTags } from "./PostTags";

export const Post = (props) => {
  let dispatch = useDispatch();
  let { isDeleteOpen } = useSelector((store) => store.modal);
  let { isSharingExporting } = useSelector((store) => store.post);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  //Helpers
  let createdAt = formatDateToString(props.createdAt);

  return (
    <div className="main-container">
      <Link
        onClick={() => {
          dispatch(setPost(props));
        }}
        to={`post/${props.id}`}
        state={{
          loggedUser: loggedUser,
          prevUrl: window.location.href,
        }}
      >
        <section className="post-container">
          <section className="post-container-content">
            <div className="post-header">
              <h1>{props.title}</h1>
            </div>
            <div className="post-information">
              <textarea
                className="post-content"
                name="content"
                rows={13}
                value={props.content}
                disabled={true}
              ></textarea>
            </div>
            <div className="post-date">
              <p>
                Created at: <span>{createdAt}</span>
              </p>
            </div>
          </section>
        </section>
      </Link>
      {isSharingExporting === false && (
        <>
          <Link
            to={`/post/${props.id}`}
            state={{
              postTitle: props.title,
              postContent: props.content,
              postUserId: props.userId,
              loggedUser: loggedUser,
            }}
          >
            <button data-action-update="update" type="button">
              <MdOutlineModeEditOutline
                onClick={() => dispatch(setPost(props))}
              />
            </button>
          </Link>
          <button data-action-delete="delete" type="button">
            <MdOutlineDelete
              onClick={() => {
                dispatch(openDeleteModal(true));
                dispatch(setPost(props));
              }}
            />
            {isDeleteOpen && <DeleteConfirmation />}
          </button>
        </>
      )}
      {isSharingExporting === true && (
        <>
          <div className="post-overlay"></div>
          <input
            type="checkbox"
            name="share-export"
            id="share-export"
            onChange={() => {
              let postsToShareExport = getSelectedPosts();

              let main = document.querySelector("main");
              let shareExportBox = document.querySelector(
                ".share-export-main-container"
              );
              let selectDataButton = document.querySelector(
                "button[data-action-select='select']"
              );
              let uncheckReminder = document.querySelector(".reminder");

              if (postsToShareExport.length > 0) {
                uncheckReminder.style.opacity = "1";
                uncheckReminder.style.visibility = "visible";
                selectDataButton.setAttribute("disabled", "");
                selectDataButton.style.cursor = "not-allowed";

                main.classList.add("selecting");
                if (
                  shareExportBox.classList.contains("share-export-position-out")
                ) {
                  shareExportBox.classList.remove("share-export-position-out");
                  shareExportBox.classList.add("share-export-position-in");
                }
                let selecting = document.querySelector(".selecting");
                selecting.style.opacity = "1";
              } else {
                uncheckReminder.style.opacity = "0";
                uncheckReminder.style.visibility = "hidden";

                selectDataButton.removeAttribute("disabled");
                selectDataButton.style.cursor = "pointer";
                main.classList.remove("selecting");
                if (
                  shareExportBox.classList.contains("share-export-position-in")
                ) {
                  shareExportBox.classList.remove("share-export-position-in");
                  shareExportBox.classList.add("share-export-position-out");
                }
                dispatch(setIsSharingExporting(false));
              }
            }}
          />
        </>
      )}

      <PostTags post={props} />
    </div>
  );
};
