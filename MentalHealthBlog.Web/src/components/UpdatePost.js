import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { application } from "../application";

export const UpdatePost = ({ propsObj }) => {
  let [title, setTitle] = useState(propsObj.postTitle);
  let [content, setContent] = useState(propsObj.postContent);
  let { id } = useParams();

  let updatePost = async (e) => {
    e.preventDefault();
    let form = new FormData(e.target);
    let formEntries = [...form.entries()];
    let formObject = Object.fromEntries(formEntries);
    let data = {
      title: formObject.title,
      content: formObject.content,
      userId: propsObj.postUserId,
    };

    console.log(data);
    let response = await fetch(`${application.application_url}/post/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      alert("Sucessfully updated post");
    } else {
      console.log("Some error occured");
    }

    window.location.href = "/";
  };

  return (
    <form onSubmit={updatePost}>
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
