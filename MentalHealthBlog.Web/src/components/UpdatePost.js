import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "./redux-toolkit/features/postSlice";
export const UpdatePost = () => {
  let dispatch = useDispatch();

  let { post } = useSelector((store) => store.post);

  let [title, setTitle] = useState(post.title);
  let [content, setContent] = useState(post.content);
  let location = useLocation();
  let navigate = useNavigate();

  let loggedUser = location.state.loggedUser;

  let update = async (e) => {
    let updatePostObj = {
      e,
      post,
      loggedUser,
    };
    console.log("Update post obj ", updatePostObj);
    dispatch(updatePost(updatePostObj));
    navigate("/", {
      state: {
        loggedUser: updatePostObj.loggedUser,
      },
    });
  };

  return (
    <form onSubmit={update}>
      <article className="post-by-id-container-edit">
        <h1> Update post:</h1>
        <p>
          New Title
          <input
            name="title"
            className="post-by-id-container-edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </p>
        <textarea
          className="post-by-id-container-edit-textarea"
          name="content"
          cols={70}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </article>
      <button className="post-by-id-container-edit-submit-button" type="submit">
        Update post
      </button>
    </form>
  );
};
