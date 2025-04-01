import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOverlayPost } from "../../redux-toolkit/features/mentalExpertSlice";
import { initialDisplayScrollsOnMentalHealthExpertSharingUsersMainPostContainers } from "../../utils/helper-methods/postHelper";

import { SharedContent } from "./SharedContent";
import { OverlayPostPreview } from "./OverlayPostPreview";

import { FaTasks } from "react-icons/fa";

export const ListSharedContent = (props) => {
  let dispatch = useDispatch();
  let { overlayPost } = useSelector((store) => store.mentalExpert);
  let sharedContent = [...props.sharedContent];

  useEffect(() => {
    initialDisplayScrollsOnMentalHealthExpertSharingUsersMainPostContainers();
  }, []);

  return (
    <section className="sharing-users-content-container">
      <div className="sharing-users-content-header">
        <h1>Shared content</h1>
        <div className="sharing-users-content-actions">
          {/* Should be changed to icon for assainment and should make hover over
           item to show tooltip about feature when it's clicked and explanation how to use it */}
          <div className="sharing-users-give-assaintment-container">
            <span className="sharing-users-give-assainment-span">
              Give Assainment
            </span>
            <FaTasks className="sharing-users-give-assainment-icon" />
          </div>
        </div>
      </div>

      {overlayPost !== null && <OverlayPostPreview content={overlayPost} />}

      <div className="sharing-users-posts">
        {sharedContent.length > 0 &&
          sharedContent.map((content) => {
            return (
              <div
                className="sharing-users-main-post-container"
                key={content.id}
                onClick={() => dispatch(setOverlayPost(content))}
              >
                <SharedContent content={content} />
              </div>
            );
          })}
      </div>
    </section>
  );
};
