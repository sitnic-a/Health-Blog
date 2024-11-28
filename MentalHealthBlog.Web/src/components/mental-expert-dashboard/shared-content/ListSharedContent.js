import React from "react";
import { SharedContent } from "./SharedContent";

export const ListSharedContent = (props) => {
  let sharedContent = [...props.sharedContent];
  return (
    <section className="sharing-users-content-container">
      <h1>Shared content</h1>

      <div className="sharing-users-posts">
        {sharedContent.length > 0 &&
          sharedContent.map((content) => {
            return (
              <div key={content.id}>
                <SharedContent content={content} />
              </div>
            );
          })}
      </div>
    </section>
  );
};
