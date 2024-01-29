import React from "react";
//Import hooks
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

//Import custom configuration and data
import { application } from "../application";

//Import components
import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { PieGraph } from "./PieGraph";

export const ListOfPosts = () => {
  let [posts, setPosts] = useState([]);
  let location = useLocation();

  let loggedUser = location.state.loggedUser;
  let url = `${application.application_url}/post?UserId=${loggedUser.id}`;

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
        .then((data) => setPosts(data.serviceResponseObject));
    };
    getPosts(url);
  }, []);

  return (
    <>
      <ListOfPostsHeader />
      <div className="dashboard">
        <section className="list-of-posts-main-container">
          {posts.map((post) => {
            return <Post key={post.id} {...post} />;
          })}
        </section>
        <section className="pie-graph-main-container">
          <PieGraph />
        </section>
      </div>
    </>
  );
};
