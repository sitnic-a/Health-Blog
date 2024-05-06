import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { openDeleteModal } from "./redux-toolkit/features/modalSlice";
import { setPost } from "./redux-toolkit/features/postSlice";

import { formatDateToString } from "./utils/helper-methods/methods";
import { PostTags } from "./PostTags";

export const Post = (props) => {
  let dispatch = useDispatch();
  let { isDeleteOpen } = useSelector((store) => store.modal);

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
          <MdOutlineModeEditOutline onClick={() => dispatch(setPost(props))} />
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

      <PostTags post={props} />
    </div>
  );
};
