import { formatDateToString } from "../../utils/helper-methods/methods";

export const SharedContent = (props) => {
  let content = props.content;
  let date = formatDateToString(content.createdAt);

  return (
    <div
      className="sharing-users-post-container"
      onClick={() => {
        console.log("ABORT MISSION");
      }}
    >
      <div className="sharing-users-post-title">
        <h2>{content.title}</h2>
        <p>{date}</p>
      </div>

      <div className="sharing-users-post-content">
        <p>{content.content}</p>
      </div>

      <div className="sharing-users-post-tags">
        <span>Tagovi: </span>
        {content.tags.map((tag) => {
          return (
            <span className="sharing-users-post-tag" key={tag}>
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
};
