import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { AddPost } from "./AddPost";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";

import { openAddModal } from "./redux-toolkit/features/modalSlice";
import { setVisibility } from "./redux-toolkit/features/filterSlice";

import { getTags } from "./redux-toolkit/features/tagSlice";
import { setIsSharingExporting } from "./redux-toolkit/features/postSlice";

export const ListOfPostsHeader = () => {
  let dispatch = useDispatch();
  let { isAddOpen } = useSelector((store) => store.modal);
  let { isSharingExporting } = useSelector((store) => store.post);

  let location = useLocation();
  let loggedUser = { ...location.state.loggedUser };

  useEffect(() => {
    dispatch(getTags());
  }, []);

  return (
    <>
      {isAddOpen && <AddPost />}

      <section className="list-of-posts-header">
        <h1 className="list-of-posts-author">
          Written by: <span>{loggedUser.username}</span>
        </h1>
        <div className="header-actions">
          <button
            data-action-add="add"
            type="button"
            onClick={() => dispatch(openAddModal(true))}
          >
            <MdOutlineAddCircleOutline />
            Add new post
          </button>

          <button
            data-action-add="filter"
            type="button"
            onClick={() => {
              dispatch(setVisibility());
            }}
          >
            Filter
          </button>

          <section className="share-export" id="share-export-id">
            <div className="share-export-select">
              <button
                data-action-select="select"
                type="button"
                data-tooltip-title="Select data"
                onClick={(e) => {
                  dispatch(setIsSharingExporting(!isSharingExporting));
                }}
              >
                <BiSelectMultiple />
              </button>
            </div>
          </section>
          <br />
        </div>
      </section>
    </>
  );
};
