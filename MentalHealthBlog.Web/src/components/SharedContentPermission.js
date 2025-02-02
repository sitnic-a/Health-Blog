import React from "react";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";

import { RiDeleteBackLine } from "react-icons/ri";
import { formatDateToString } from "./utils/helper-methods/methods";
import { useDispatch } from "react-redux";
import { revokeContentPermission } from "./redux-toolkit/features/regularUserSlice";

export const SharedContentPermission = () => {
  let dispatch = useDispatch();

  let { contentSharedWithMentalHealthExpert, mentalHealthExpert } =
    useFetchLocationState();

  console.log(
    "Content ",
    contentSharedWithMentalHealthExpert,
    "MHE ",
    mentalHealthExpert
  );

  return (
    <div className="content-shared-with-mental-health-expert-main-container">
      <div className="content-shared-with-mental-health-expert-hero">
        {mentalHealthExpert && (
          <h2>
            <span className="content-shared-with-mental-health-expert-hero-username">
              {mentalHealthExpert.username}{" "}
            </span>
            read permission list
          </h2>
        )}
        <p className="content-shared-with-mental-health-expert-title">
          Everything shared with mental health expert
        </p>
        <p className="content-shared-with-mental-health-expert-subtitle">
          Check the list below:
        </p>
      </div>
      {contentSharedWithMentalHealthExpert.length > 0 && (
        <div className="content-shared-with-mental-health-expert-posts">
          {contentSharedWithMentalHealthExpert.map((post, index) => {
            let createdAt = formatDateToString(post.createdAt);
            let sharedAt = formatDateToString(post.sharedAt);
            return (
              <div
                id={post.id}
                key={post.id}
                className="content-shared-with-mental-health-expert-post-main-container"
              >
                <div className="content-shared-with-mental-health-expert-container">
                  <div className="content-shared-with-mental-health-expert-index-container">
                    <span className="content-shared-with-mental-health-expert-index">
                      {index + 1}
                    </span>
                  </div>
                  <div className="content-shared-with-mental-health-expert-post-info-container">
                    <span className="content-shared-with-mental-health-expert-post-title">
                      {post.title}
                    </span>
                    <div className="content-shared-with-mental-health-expert-post-tags">
                      {Object.values(post.tags).map((tag) => {
                        return (
                          <span
                            className="content-shared-with-mental-health-expert-post-tag"
                            key={tag}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <div className="content-shared-with-mental-health-expert-date-container">
                      <span className="content-shared-with-mental-health-expert-created-date">
                        Created: {createdAt}
                      </span>

                      <span className="content-shared-with-mental-health-expert-shared-date">
                        Shared: {sharedAt}
                      </span>
                    </div>
                  </div>
                  <div className="content-shared-with-mental-health-expert-actions">
                    <RiDeleteBackLine
                      className="content-shared-with-mental-health-expert-revoke-action"
                      onClick={() => {
                        let revokeObject = {
                          postId: post.id,
                          sharedWithId: mentalHealthExpert.userId,
                        };
                        console.log("Revoke obj ", { revokeObject });

                        dispatch(revokeContentPermission(revokeObject)).then(
                          () => {
                            var postContainers = document.querySelectorAll(
                              ".content-shared-with-mental-health-expert-post-main-container"
                            );
                            postContainers.forEach((postContainer) => {
                              if (
                                parseInt(postContainer.getAttribute("id")) ===
                                post.id
                              ) {
                                postContainer.classList.add("zoom");
                                contentSharedWithMentalHealthExpert =
                                  contentSharedWithMentalHealthExpert.filter(
                                    (c) => c.id !== post.id
                                  );
                              }
                            });
                          }
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
