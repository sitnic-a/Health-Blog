import React from "react";
import { useSelector } from "react-redux";
import { ListSharingContentUsers } from "../components/mental-expert-dashboard/shared-content/ListSharingContentUsers";
import { ListSharedContent } from "../components/mental-expert-dashboard/shared-content/ListSharedContent";

export const MentalExpertDashboard = () => {
  let { sharedContent } = useSelector((store) => store.mentalExpert);

  return (
    <section className="mental-expert-dashboard">
      <section id="sharing-users-main-container">
        <ListSharingContentUsers />
        {sharedContent.length > 0 && (
          <ListSharedContent sharedContent={[...sharedContent]} />
        )}
      </section>
    </section>
  );
};
