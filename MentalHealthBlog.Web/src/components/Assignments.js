import React from "react";
import { useParams } from "react-router-dom";

export const Assignments = () => {
  let { id } = useParams();

  return <div>User Assignment for user with id {id} </div>;
};
