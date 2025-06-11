import React from "react";
import { useParams } from "react-router-dom";

export const Assignments = () => {
  let { id } = useParams();

  return (
    <div>
      Mental Health Expert Assignments for mental health expert with id {id}
    </div>
  );
};
