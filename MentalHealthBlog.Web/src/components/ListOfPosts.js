import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux-toolkit/features/postSlice";

import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { Loader } from "./Loader";
import { PieGraph } from "./PieGraph";

import { FilterOptions } from "./FilterOptions";

export const ListOfPosts = () => {
  let dispatch = useDispatch();
  let { isLoading, posts } = useSelector((store) => store.post);
  let { isLogging } = useSelector((store) => store.user);
  let { statisticsLoading } = useSelector((store) => store.pie);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  let searchPostDto = {
    loggedUser,
    monthOfPostCreation: 0,
  };

  useEffect(() => {
    dispatch(getPosts(searchPostDto));
  }, []);

  if (isLoading && isLogging && statisticsLoading) {
    <Loader />;
  }

  return (
    <div className="dashboard">
      <ListOfPostsHeader />

      <FilterOptions searchPostDto={searchPostDto} />

      <div className="dashboard-cols">
        <section className="list-of-posts-main-container">
          {posts.map((post) => {
            return <Post key={post.id} {...post} />;
          })}
        </section>

        <section className="pie-graph-main-container">
          <PieGraph searchPostDto={searchPostDto} />
        </section>
      </div>
    </div>
  );
};
