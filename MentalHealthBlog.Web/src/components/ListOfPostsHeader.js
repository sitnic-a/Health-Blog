import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { application } from "../application";

import { AddPost } from "./AddPost";

import { MdOutlineAddCircleOutline } from "react-icons/md";

export const ListOfPostsHeader = () => {
  let location = useLocation();
  let [isCreatingPost, setIsCreatingPost] = useState(false);
  let [dbTags, setDbTags] = useState([]);
  let url = `${application.application_url}/tag`;

  useEffect(() => {
    let getAllTags = async (url) => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDbTags(data.serviceResponseObject);
          console.log(dbTags);
        });
    };
    getAllTags(url);
  }, []);

  let loggedUser = { ...location.state.loggedUser };
  return (
    <>
      {isCreatingPost && <AddPost tags={dbTags} />}
      <section className="list-of-posts-header">
        <h1 className="list-of-posts-author">
          Written by: {loggedUser.username}
        </h1>
        <button
          data-action-add="add"
          type="button"
          onClick={() => setIsCreatingPost(!isCreatingPost)}
        >
          <MdOutlineAddCircleOutline />
          Add new post
        </button>
      </section>
    </>
  );
};
