import { useState } from "react";
import { useLocation } from "react-router";

import { AddPost } from "./AddPost";

import { MdOutlineAddCircleOutline } from "react-icons/md";

export const ListOfPostsHeader = () => {
  let location = useLocation();
  let [isCreatingPost, setIsCreatingPost] = useState(false);

  let loggedUser = { ...location.state.loggedUser };
  return (
    <>
      {isCreatingPost && <AddPost />}
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
