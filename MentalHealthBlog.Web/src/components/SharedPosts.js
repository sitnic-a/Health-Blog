import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shareByLink } from "./redux-toolkit/features/shareExportSlice";

import { Loader } from "./Loader";
import { ListOfSharedPosts } from "./share-export/share/ListOfSharedPosts";

export const SharedPosts = () => {
  let dispatch = useDispatch();
  let { postsToShare, isLoading } = useSelector((store) => store.shareExport);

  useEffect(() => {
    let url = window.location.href;
    if (url.includes("share/link")) {
      let urlParts = url.split("/");
      let shareGuid = urlParts[urlParts.length - 1];
      dispatch(shareByLink(shareGuid));
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    /* Shares via link */
    postsToShare !== null &&
    postsToShare.length > 0 && (
      <section className="user-shared-content">
        <h1>Content:</h1>
        <ListOfSharedPosts />
      </section>
      /* Shares per doctor to make */
    )
  );
};
