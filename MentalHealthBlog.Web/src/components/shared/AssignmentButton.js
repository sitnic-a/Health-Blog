import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks } from "react-icons/fa";

export const AssignmentButton = () => {
  let navigate = useNavigate();

  return (
    <div
      className="sharing-users-give-assignment-container"
      onClick={() => {
        navigate("/create-assignment");
      }}
    >
      <span className="sharing-users-give-assignment-span">
        Give Assignment
      </span>
      <FaTasks className="sharing-users-give-assignment-icon" />
    </div>
  );
};
