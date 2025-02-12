import React from "react";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";

import { SharedContentPermissionPosts } from "./SharedContentPermissionPosts";

export const SharedContentPermission = () => {
  let { mentalHealthExpert } = useFetchLocationState();

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
        <SharedContentPermissionPosts />
      </div>
    </div>
  );
};
