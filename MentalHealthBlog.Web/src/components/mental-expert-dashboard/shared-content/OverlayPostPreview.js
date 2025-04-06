import { useDispatch } from "react-redux";
import { setOverlayPost } from "../../redux-toolkit/features/mentalExpertSlice";
import { formatDateToString } from "../../utils/helper-methods/methods";

import { PostEmotions } from "../../PostEmotions";

export const OverlayPostPreview = (props) => {
  let dispatch = useDispatch();
  let contentPost = props.content;

  let createdAt;
  if (contentPost !== null || contentPost !== undefined) {
    createdAt = formatDateToString(contentPost.createdAt);
  }

  return (
    contentPost !== null && (
      <div
        className="overlay-post-main-container"
        onClick={(e) => {
          let overlayPost = document.querySelector(".overlay-post-container");
          if (overlayPost.contains(e.target)) {
            return;
          } else {
            dispatch(setOverlayPost(null));
          }
        }}
      >
        <div className="overlay-post-container">
          <div
            className="overlay-post-actions"
            onClick={() => {
              dispatch(setOverlayPost(null));
            }}
          >
            <span>X</span>
          </div>
          <div className="overlay-post-content-container">
            <div className="overlay-post-title">
              <h1>{contentPost.title}</h1>
            </div>
            <div className="overlay-post-content">
              <pre>{contentPost.content}</pre>
            </div>
            <p>Tags: </p>
            <div className="overlay-post-tags-container">
              {contentPost.tags.map((tag) => {
                return (
                  <span key={tag} className="overlay-post-tag">
                    {tag}
                  </span>
                );
              })}
            </div>

            <div className="overlay-post-emotions-container">
              <p>Emotions: </p>
              <PostEmotions post={contentPost} />
            </div>

            <div className="overlay-post-date">
              <p>{createdAt}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
