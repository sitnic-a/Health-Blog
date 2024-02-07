import React from "react";
import { useEffect, useState, useReducer } from "react";
//Import hooks
import { useLocation } from "react-router";

//Import custom configuration and data
import { application } from "../application";

//Import components
import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { PieGraph } from "./PieGraph";

import { Loader } from "./Loader";
import globalState from "./utils/globalState";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux-toolkit/features/postSlice";

export const ListOfPosts = () => {
  let dispatch = useDispatch();
  let { isLoading, posts } = useSelector((store) => store.post);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  useEffect(() => {
    dispatch(getPosts(loggedUser));
  }, []);

  if (isLoading) {
    <Loader />;
  }

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
