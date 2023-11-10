import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { application } from "../application";
import { log } from "react-modal/lib/helpers/ariaAppHider";

export const PostById = () => {
  let [stateNull, setStateNull] = useState(true);

  const location = useLocation();
  let [propsObj, setPropsObj] = useState({ ...location.state });
  let [post, setPost] = useState({});
  let [title, setTitle] = useState(propsObj.postTitle);
  let [content, setContent] = useState(propsObj.postContent);
  let { id } = useParams();

  let fetchPost = async () => {
    try {
      let postResponse = await fetch(
        `${application.application_url}/post/${id}`
      ).then((response) => response.json());
      setPost(postResponse);
      if (location.state !== null) {
        setStateNull(false);
        setPropsObj({
          postTitle: location.state.postTitle,
          postContent: location.state.postContent,
        });
      }
    } catch (error) {
      console.log(error.name);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <section className="post-by-id">
      <article className="post-by-id-container">
        <h1>{post.title}</h1>
        <p>Written by: [name] {post.userId}</p>
        <pre>
          <div>{post.content}</div>
        </pre>
      </article>
      {!stateNull && (
        <article className="post-by-id-container-edit">
          <h1>Update post:</h1>
          <p htmlFor="title">
            New Title
            <input
              name="title"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </p>
          <textarea
            name="post-by-id-content-edit-textarea"
            value={content}
            cols={70}
            id="post-by-id-content-edit-textarea"
            className="post-by-id-content-edit-textarea"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </article>
      )}
    </section>
  );
};
