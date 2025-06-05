import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";
import {
  getSharesPerMentalHealthExpert,
  revokeContentPermission,
} from "./redux-toolkit/features/regularUserSlice";

import { formatDateToString } from "./utils/helper-methods/methods";

import { RiDeleteBackLine } from "react-icons/ri";
import { toast } from "react-toastify";

export const SharedContentPermissionPosts = () => {
  let dispatch = useDispatch();
  let { authenticatedUser } = useSelector((store) => store.user);
  let { sharesPerMentalHealthExpert, hasSharedPosts } = useSelector(
    (store) => store.regularUser
  );

  let { mentalHealthExpert } = useFetchLocationState();

  let contentSharedWithMentalHealthExpert = sharesPerMentalHealthExpert?.filter(
    (mhe) =>
      mhe.mentalHealthExpertContentSharedWith.id === mentalHealthExpert.id
  );

  useEffect(() => {
    let objectWithData = {
      query: {
        loggedUserId: authenticatedUser.id,
      },
      authenticatedUser,
    };
    dispatch(getSharesPerMentalHealthExpert(objectWithData));
  }, []);

  return (
    <>
      {contentSharedWithMentalHealthExpert[0]?.sharedContent?.length > 0 && (
        <div className="content-shared-with-mental-health-expert-posts">
          {contentSharedWithMentalHealthExpert[0]?.sharedContent?.map(
            (post, index) => {
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
                          let objectWithData = {
                            revokeObject: {
                              postId: post.id,
                              sharedWithId: mentalHealthExpert.id,
                              loggedUserId: authenticatedUser.id,
                            },
                            authenticatedUser,
                          };

                          dispatch(
                            revokeContentPermission(objectWithData)
                          ).then((data) => {
                            let statusCode = data?.payload?.StatusCode;

                            if (statusCode !== 200) {
                              if (statusCode === 400) {
                                toast.error(
                                  "This post doesn't have permission!",
                                  {
                                    position: "bottom-right",
                                  }
                                );
                                return;
                              }

                              if (statusCode === 404) {
                                toast.error(
                                  "Can't revoke permission! Try again!",
                                  {
                                    autoClose: 1500,
                                    position: "bottom-right",
                                  }
                                );
                                return;
                              }
                            }

                            if (data?.payload?.statusCode === 200) {
                              var postMainContainer =
                                e.target.parentElement.parentElement
                                  .parentElement;

                              postMainContainer.classList.add("zoom");
                              setTimeout(() => {
                                postMainContainer.remove();
                              }, 250);

                              toast.success(
                                `This content is no longer visible to ${mentalHealthExpert.firstName} ${mentalHealthExpert.lastName}`,
                                {
                                  position: "bottom-right",
                                }
                              );
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
      {!hasSharedPosts && (
        <div className="content-shared-with-mental-health-expert-posts">
          <p>There are no posts or content to revoke permission for!</p>
        </div>
      )}
    </>
  );
};
