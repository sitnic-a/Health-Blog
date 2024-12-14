import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shareByLink } from "./redux-toolkit/features/shareExportSlice";

export const SharedPosts = () => {
  let dispatch = useDispatch();
  let { postsToShare } = useSelector((store) => store.shareExport);

  useEffect(() => {
    let url = window.location.href;
    if (url.includes("share/link")) {
      let urlParts = url.split("/");
      let shareGuid = urlParts[urlParts.length - 1];
      dispatch(shareByLink(shareGuid));
    }
  }, []);

  return (
    /* Shares via link */
    postsToShare !== null &&
    postsToShare.length > 0 && (
      <section className="user-shared-content">
        <h1>Content:</h1>
        {postsToShare.map((post) => {
          return (
            <div key={post.id}>
              <h1>{post.title}</h1>
            </div>
          );
        })}
      </section>
      /* Shares per doctor to make */
    )
  );
};
