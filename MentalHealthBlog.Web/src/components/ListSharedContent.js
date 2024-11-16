import React from "react";
import { formatDateToString } from "./utils/helper-methods/methods";

export const ListSharedContent = (props) => {
  let sharedContent = [...props.sharedContent];
  return (
    <section className="sharing-users-content-container">
      <h1>Shared content</h1>

      <div className="sharing-users-posts">
        {sharedContent.length > 0 &&
          sharedContent.map((content) => {
            let date = formatDateToString(content.createdAt);
            return (
              <div
                className="sharing-users-post-container"
                onClick={() => {
                  console.log("ABORT MISSION");
                }}
                key={content.id}
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
          })}
      </div>
    </section>
  );
};
