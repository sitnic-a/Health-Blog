import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { application } from "../application";
import { UpdatePost } from "./UpdatePost";

export const PostById = () => {
  let [stateNull, setStateNull] = useState(true);
  const location = useLocation();
  let [propsObj, setPropsObj] = useState({ ...location.state });
  let [post, setPost] = useState({});

  let { id } = useParams();

  let fetchPost = async () => {
    try {
      await fetch(`${application.application_url}/post/${id}`)
        .then((response) => response.json())
        .then((data) => setPost(data));

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
      {!stateNull && <UpdatePost propsObj={propsObj} />}
    </section>
  );
};
