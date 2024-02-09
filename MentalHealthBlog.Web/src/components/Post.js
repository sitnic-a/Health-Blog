import React from "react";
import { Link, useLocation } from "react-router-dom";

import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { useSelector, useDispatch } from "react-redux";
import { openDeleteModal } from "./redux-toolkit/features/modalSlice";

export const Post = (props) => {
  let dispatch = useDispatch();
  let { isDeleteOpen } = useSelector((store) => store.modal);

  let location = useLocation();

  let dbObject = { ...props };
  let loggedUser = location.state.loggedUser;
  return (
    <div className="main-container">
      <Link to={`post/${props.id}`}>
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
          <MdOutlineModeEditOutline />
        </button>
      </Link>
      <button data-action-delete="delete" type="button">
        <MdOutlineDelete onClick={() => dispatch(openDeleteModal(true))} />
        {isDeleteOpen && <DeleteConfirmation {...props} />}
      </button>

      <div className="post-container-tags">
        {props.tags.map((tag) => {
          return (
            <span className="add-post-content-picked-tags-span-tag " key={tag}>
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
};
