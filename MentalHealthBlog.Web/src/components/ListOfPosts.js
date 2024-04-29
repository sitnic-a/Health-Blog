import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux-toolkit/features/postSlice";
import {
  prepareForPieGraph,
  setRerendering,
} from "./redux-toolkit/features/pieSlice";

import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { Loader } from "./Loader";
import { PieGraph } from "./PieGraph";

import moment from "moment";
import { formatStringToDate } from "./utils/helper-methods/methods";

export const ListOfPosts = () => {
  let [months, setMonths] = useState([]);

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

  let filterPosts = (e) => {
    searchPostDto = {
      loggedUser,
      monthOfPostCreation: e.target.selectedIndex,
    };
    console.log("On change obj ", searchPostDto);
    dispatch(getPosts(searchPostDto));
    dispatch(setRerendering());
    dispatch(prepareForPieGraph(searchPostDto));
  };

  useEffect(() => {
    dispatch(getPosts(searchPostDto));
    setMonths(moment.months());
  }, []);

  if (isLoading && isLogging && statisticsLoading) {
    <Loader />;
  }

  return (
    <div className="dashboard">
      <ListOfPostsHeader />

      <div className="dashboard-filter-container">
        <h3>Filter:</h3>
        <div className="dashboard-filter-options">
          <div className="filter-by-month">
            <p>Month:</p>
            <select
              name="filter-by-month"
              id="filter-by-month"
              onChange={(e) => filterPosts(e)}
            >
              <option>Pick a month</option>
              {months.map((month, index) => {
                return (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
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
