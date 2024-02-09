import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux-toolkit/features/postSlice";
import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { Loader } from "./Loader";
import { PieGraph } from "./PieGraph";

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
