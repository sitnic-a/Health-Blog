import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSharingExporting } from "./redux-toolkit/features/postSlice";
import { setVisibility } from "./redux-toolkit/features/filterSlice";
import { getTags } from "./redux-toolkit/features/tagSlice";
import { openAddModal } from "./redux-toolkit/features/modalSlice";

import { AddPost } from "./AddPost";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";
import { TbColumns3 } from "react-icons/tb";
import { TbColumns2 } from "react-icons/tb";
import { TbColumns1 } from "react-icons/tb";

export const ListOfPostsHeader = () => {
  let dispatch = useDispatch();
  let { authenticatedUser } = useSelector((store) => store.user);
  let { isAddOpen } = useSelector((store) => store.modal);
  let { isSharingExporting } = useSelector((store) => store.post);
  let layouts = document.querySelectorAll(".layout-type");
  console.log("Layouts ", layouts);

  useEffect(() => {
    dispatch(getTags());
  }, []);

  layouts.forEach((layout) => {
    layout.addEventListener("click", (e) => {
      console.log("Ee ", e.currentTarget);
      let layoutPickerTypes = document.querySelector(".layout-picker-types");

      let index = [...layouts].indexOf(e.currentTarget);
    });
  });

  return (
    <>
      {isAddOpen && <AddPost />}

      <section
        className="list-of-posts-header"
        onMouseOver={() => {
          let listPostsHeader = document.querySelector(".list-of-posts-header");
          listPostsHeader.style.marginBottom = "2rem";
        }}
        onMouseLeave={() => {
          let listPostsHeader = document.querySelector(".list-of-posts-header");
          listPostsHeader.style.marginBottom = "0";
        }}
      >
        <h1 className="list-of-posts-author">
          Written by: <span>{authenticatedUser.username}</span>
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

          <section id="layout-picker-main-container">
            <div className="layout-picker-container">
              <div className="layout-picker-types">
                <div className="layout-type default-layout-container">
                  <TbColumns3 className="layout-view-icon" />
                </div>

                <div className="layout-type two-columns-layout-container">
                  <TbColumns2 className="layout-view-icon" />
                </div>

                <div className="layout-type single-column-layout-container">
                  <TbColumns1 className="layout-view-icon" />
                </div>
              </div>
            </div>
          </section>
          <br />
        </div>
      </section>
    </>
  );
};
