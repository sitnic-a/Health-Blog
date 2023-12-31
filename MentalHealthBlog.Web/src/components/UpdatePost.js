import React from "react";
import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { application } from "../application";
import { toast } from "react-toastify";

export const UpdatePost = ({ propsObj }) => {
  let [title, setTitle] = useState(propsObj.postTitle);
  let [content, setContent] = useState(propsObj.postContent);
  let { id } = useParams();
  let location = useLocation();
  let navigate = useNavigate();

  let loggedUser = location.state.loggedUser;
  console.log(`Update Post loggedUser`, loggedUser);

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
    if (
      data.title === "" ||
      data.title === null ||
      data.content === "" ||
      data.content === null
    ) {
      toast.error("Fields should be populated!", {
        autoClose: 1500,
        position: "bottom-right",
      });
      return;
    }

    let response = await fetch(`${application.application_url}/post/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedUser.token}`,
      },
    });

    if (response.status === 200) {
      alert("Sucessfully updated post");
      toast.success("Succesfully updated", {
        autoClose: 1500,
        position: "bottom-right",
      });
    } else {
      console.log("Some error occured");
      toast.error("Couldn't update post", {
        autoClose: 1500,
        position: "bottom-right",
      });
    }

    navigate("/", {
      state: {
        loggedUser: loggedUser,
      },
    });
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
