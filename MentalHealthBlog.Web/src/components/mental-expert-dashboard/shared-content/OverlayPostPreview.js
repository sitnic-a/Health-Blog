import { formatDateToString } from "../../utils/helper-methods/methods";

export const OverlayPostPreview = (props) => {
  let contentPost = props.content;

  let createdAt;
  if (contentPost !== null || contentPost !== undefined) {
    createdAt = formatDateToString(contentPost.createdAt);
  }
  return (
    contentPost !== null && (
      <div className="overlay-post-main-container">
        <div className="overlay-post-container">
          <div className="overlay-post-actions">
            <span>X</span>
          </div>
          <div className="overlay-post-content-container">
            <div className="overlay-post-title">
              <h1>{contentPost.title}</h1>
            </div>
            <div className="overlay-post-content">
              <pre>{contentPost.content}</pre>
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
