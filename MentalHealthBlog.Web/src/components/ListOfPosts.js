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

import { toast } from "react-toastify";

import { FaShare } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";

export const ListOfPosts = () => {
  let dispatch = useDispatch();
  let { isLoading, posts } = useSelector((store) => store.post);
  let { isLogging, isAuthenticated } = useSelector((store) => store.user);

  let { statisticsLoading } = useSelector((store) => store.pie);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  let searchPostDto = {
    loggedUser,
    monthOfPostCreation: 0,
  };

  useEffect(() => {
    let prevUrl = location.state.prevUrl;

    if (isAuthenticated === true && prevUrl.includes("login")) {
      toast.success("Succesfully logged in", {
        autoClose: 1500,
        position: "bottom-right",
      });
    }
    dispatch(getPosts(searchPostDto));
  }, []);

  if (isLoading && isLogging && statisticsLoading) {
    <Loader />;
  }

  return (
    <div className="dashboard">
      <ListOfPostsHeader />

      <section className="share-export-main-container share-export-position-out">
        <div className="share-export-container ">
          <section
            className="share-icon-container"
            onClick={() => {
              alert("Share activated");
            }}
          >
            <FaShare className="share-export-icon" />
          </section>
          <section
            className="export-icon-container"
            onClick={() => {
              alert("Export activated");
            }}
          >
            <FaFileExport className="share-export-icon" />
          </section>
        </div>
      </section>
      <FilterOptions searchPostDto={searchPostDto} />
      <div className="reminder">
        <p className="unselect-data-reminder">
          IMPORTANT: Uncheck all selected post if you want to exit share/export
          mode!!
        </p>
      </div>
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
