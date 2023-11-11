import React from "react";
import { useState } from "react";

export const UpdatePost = ({ propsObj }) => {
  let [title, setTitle] = useState(propsObj.postTitle);
  let [content, setContent] = useState(propsObj.postContent);
  return (
    <form>
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
      <button
        className="post-by-id-container-edit-submit-button"
        type="submit"
        onClick={() => alert("Updated")}
      >
        Update post
      </button>
    </form>
  );
};
