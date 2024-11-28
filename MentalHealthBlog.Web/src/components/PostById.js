import React from "react";
import { useSelector } from "react-redux";
import { UpdatePost } from "./UpdatePost";

export const PostById = () => {
  let { post } = useSelector((store) => store.post);
  console.log("Post by id ", post);

  return (
    <section className="post-by-id">
      <article className="post-by-id-container">
        <h1>{post.title}</h1>
        <p>Written by: [name] {post.userId}</p>
        <pre>
          <div>{post.content}</div>
        </pre>
      </article>
      {post !== undefined && <UpdatePost />}
    </section>
  );
};
