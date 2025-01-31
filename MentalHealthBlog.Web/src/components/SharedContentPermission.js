import React from "react";
import useFetchLocationState from "./custom/hooks/useFetchLocationState";

export const SharedContentPermission = () => {
  let { contentSharedWithMentalHealthExpert, mentalHealthExpert } =
    useFetchLocationState();
  console.log("MHE ", contentSharedWithMentalHealthExpert);

  return (
    <div className="content-shared-with-mental-health-expert-main-container">
      <div className="content-shared-with-mental-health-expert-hero">
        {mentalHealthExpert && (
          <h2>
            Mental health expert <span>{mentalHealthExpert.username} </span>
            permission list
          </h2>
        )}
        <p className="content-shared-with-mental-health-expert-title">
          Posts list:
        </p>
      </div>
      {contentSharedWithMentalHealthExpert.length > 0 &&
        contentSharedWithMentalHealthExpert.map((post) => {
          return (
            <div
              key={post.id}
              className="content-shared-with-mental-health-expert-post-main-container"
              style={{ display: "flex", gap: "20px", alignItems: "center" }}
            >
              <p>{post.title}</p>
              <span>Revoke permission</span>
            </div>
          );
        })}
    </div>
  );
};
