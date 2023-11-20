import React from "react";
//Import hooks
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

//Import custom configuration and data
import { application } from "../application";

//Import components
import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";

export const ListOfPosts = () => {
  let [posts, setPosts] = useState([]);
  let location = useLocation();

  let url = `${application.application_url}/post`;
  let loggedUser = location.state.loggedUser;

  useEffect(() => {
    let getPosts = async (url) => {
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setPosts(data));
    };
    getPosts(url);
  }, []);

  return (
    <>
      <ListOfPostsHeader />
      <section className="list-of-posts-main-container">
        {posts.map((post) => {
          return <Post key={post.id} {...post} />;
        })}
      </section>
    </>
  );
};
