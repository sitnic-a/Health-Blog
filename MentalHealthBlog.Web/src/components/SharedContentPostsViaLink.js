import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { shareByLink } from "./redux-toolkit/features/shareExportSlice";
import { ListOfSharedPosts } from "./share-export/share/ListOfSharedPosts";

export const SharedContentPostsViaLink = () => {
  let dispatch = useDispatch();

  useEffect(() => {
    let url = window.location.href;
    if (url.includes("share/link")) {
      let urlParts = url.split("/");
      let shareGuid = urlParts[urlParts.length - 1];
      dispatch(shareByLink(shareGuid));
    }
  }, []);

  let { postsToShare } = useSelector((store) => store.shareExport);

  return (
    postsToShare !== null &&
    postsToShare.length > 0 && (
      <section className="user-shared-content">
        <h1>Content:</h1>
        <ListOfSharedPosts />
      </section>
    )
  );
};
