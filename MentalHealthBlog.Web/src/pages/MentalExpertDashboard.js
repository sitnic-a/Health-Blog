import React from "react";
import { useSelector } from "react-redux";
import { ListSharingContentUsers } from "../components/mental-expert-dashboard/shared-content/ListSharingContentUsers";
import { ListSharedContent } from "../components/mental-expert-dashboard/shared-content/ListSharedContent";
import { Logout } from "../components/shared/Logout";
import { ReviewAssignmentsButton } from "../components/shared/ReviewAssignmentsButton";

export const MentalExpertDashboard = () => {
  let { sharedContent, usersThatSharedIncludingItsContent } = useSelector(
    (store) => store.mentalExpert
  );

  return (
    <section className="mental-expert-dashboard">
      <div className="mental-expert-navigation-bar">
        <div className="left">
          <ReviewAssignmentsButton />
        </div>
        <Logout />
      </div>
      <section id="sharing-users-main-container">
        <ListSharingContentUsers />

        {usersThatSharedIncludingItsContent?.length === 0 && (
          <div className="sharing-users-main-content-container">
            <div className="sharing-users-main-content-info">
              <p>Nothing shared</p>
            </div>
          </div>
        )}

        {usersThatSharedIncludingItsContent?.length > 0 &&
          sharedContent?.length === 0 && (
            <div className="sharing-users-main-content-container">
              <div className="sharing-users-main-content-info">
                <p>
                  <span>NOTE: </span>If you want to review users content, pick a
                  user by clicking arrows icon and then user box or simply user
                  box!
                </p>
              </div>
            </div>
          )}

        {sharedContent.length > 0 && (
          <ListSharedContent sharedContent={[...sharedContent]} />
        )}
      </section>
    </section>
  );
};
