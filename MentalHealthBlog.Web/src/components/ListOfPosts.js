import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";
import { toast } from "react-toastify";
import { getPosts } from "./redux-toolkit/features/postSlice";

import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { Loader } from "./Loader";
import { PieGraph } from "./PieGraph";

import { FilterOptions } from "./FilterOptions";

import { ShareExportOverlay } from "./share-export/ShareExportOverlay";
import { ShareModal } from "./share-export/share/ShareModal";
import { ExportModal } from "./share-export/export/ExportModal";

export const ListOfPosts = () => {
  let dispatch = useDispatch();
  let { loggedUser, prevUrl } = useFetchLocationState();
  let { isLoading, posts } = useSelector((store) => store.post);
  let { isLogging, isAuthenticated } = useSelector((store) => store.user);

  let { statisticsLoading } = useSelector((store) => store.pie);

  let searchPostDto = {
    loggedUser,
    monthOfPostCreation: 0,
  };

  useEffect(() => {
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
      <ShareModal />
      <ExportModal />

      <ShareExportOverlay />
      <div className="reminder">
        <p className="unselect-data-reminder">
          IMPORTANT: Uncheck all selected post if you want to exit share/export
          mode!!
        </p>
      </div>

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
