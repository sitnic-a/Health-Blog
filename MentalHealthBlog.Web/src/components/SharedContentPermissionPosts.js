import React from "react";
import { useDispatch } from "react-redux";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";
import { revokeContentPermission } from "./redux-toolkit/features/regularUserSlice";
import { formatDateToString } from "./utils/helper-methods/methods";

import { RiDeleteBackLine } from "react-icons/ri";

export const SharedContentPermissionPosts = () => {
  let dispatch = useDispatch();

  let { mentalHealthExpert, contentSharedWithMentalHealthExpert } =
    useFetchLocationState();

  return (
    contentSharedWithMentalHealthExpert.length > 0 && (
      <div className="content-shared-with-mental-health-expert-posts">
        {contentSharedWithMentalHealthExpert.map((post, index) => {
          let createdAt = formatDateToString(post.createdAt);
          let sharedAt = formatDateToString(post.sharedAt);
          return (
            <div
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
                    title="revoke/delete read permission"
                    className="content-shared-with-mental-health-expert-revoke-action"
                    onClick={(e) => {
                      let revokeObject = {
                        postId: post.id,
                        sharedWithId: mentalHealthExpert.userId,
                      };

                      dispatch(revokeContentPermission(revokeObject)).then(
                        () => {
                          var postMainContainer =
                            e.target.parentElement.parentElement.parentElement;

                          postMainContainer.classList.add("zoom");
                          setTimeout(() => {
                            postMainContainer.remove();
                          }, 250);
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
    )
  );
};
