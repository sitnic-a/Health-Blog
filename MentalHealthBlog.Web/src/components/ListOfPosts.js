import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./redux-toolkit/features/postSlice";

import { Post } from "./Post";
import { ListOfPostsHeader } from "./ListOfPostsHeader";
import { Loader } from "./Loader";
import { PieGraph } from "./PieGraph";

import { FilterOptions } from "./FilterOptions";

import { toast } from "react-toastify";

import { FaShare } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { LiaSearchSolid } from "react-icons/lia";
import { IoPersonOutline } from "react-icons/io5";
import {
  base64ToArrayBuffer,
  getSelectedPosts,
} from "./utils/helper-methods/methods";
import {
  openExportModal,
  openShareModal,
} from "./redux-toolkit/features/modalSlice";
import { exportToPDF } from "./redux-toolkit/features/shareExportSlice";

import defaultAvatar from "../images/default-avatar.png";

export const ListOfPosts = () => {
  console.log(defaultAvatar);

  let dispatch = useDispatch();
  let { isLoading, posts } = useSelector((store) => store.post);
  let { isLogging, isAuthenticated } = useSelector((store) => store.user);
  let { isExportOpen, isShareOpen } = useSelector((store) => store.modal);
  let { postsToExport, isExported, exportedDocument } = useSelector(
    (store) => store.shareExport
  );

  let { statisticsLoading } = useSelector((store) => store.pie);

  let location = useLocation();
  let loggedUser = location.state.loggedUser;

  let searchPostDto = {
    loggedUser,
    monthOfPostCreation: 0,
  };

  useEffect(() => {
    let prevUrl = location.state.prevUrl;

    if (isAuthenticated === true && prevUrl.includes("login")) {
      toast.success("Succesfully logged in", {
        autoClose: 1500,
        position: "bottom-right",
      });
    }
    dispatch(getPosts(searchPostDto));
  }, []);

  if (isLoading && isLogging && statisticsLoading) {
    <Loader />;
  }

  return (
    <div className="dashboard">
      <ListOfPostsHeader />

      {isShareOpen && (
        <section className="share-modal-overlay">
          <section className="share-modal-container">
            <span
              className="share-export-close-modal-btn"
              onClick={() => {
                dispatch(openShareModal(!isShareOpen));
                let shareExportContainer = document.querySelector(
                  ".share-export-container"
                );
                shareExportContainer.style.display = "flex";
              }}
            >
              X
            </span>

            <h4>Share posts...</h4>
            <div className="share-posts-container">
              {/* Array of selected posts */}

              <div className="share-post-container">
                <p className="share-post-title">Post_01</p>
                <span
                  className="revoke-btn"
                  onClick={() => {
                    console.log("Content removed from the list!");
                  }}
                >
                  <IoRemoveCircleOutline />
                </span>
              </div>

              <div className="share-post-container">
                <p className="share-post-title">Post_01</p>
                <span className="revoke-btn">
                  <IoRemoveCircleOutline />
                </span>
              </div>
            </div>

            <div className="share-people-container">
              <div className="search-people">
                <span>
                  <LiaSearchSolid />
                </span>
                <input
                  type="text"
                  name="search-by-first-last-name"
                  id="search-by-first-last-name"
                  placeholder="Search by first/last name..."
                />
              </div>

              <div className="people-to-give-permission-container">
                <div className="people-to-give-permission">
                  <div className="person-to-give-permission-container">
                    <div className="permission-action">
                      <input
                        type="checkbox"
                        name="person-to-give-permission-checkbox"
                        id="person-to-give-permission-checkbox"
                      />
                    </div>

                    <div className="person-to-give-permission-information">
                      <div className="person-to-give-permission-img-container">
                        <img
                          className="person-to-give-permission-img"
                          src={defaultAvatar}
                          alt="Person photo"
                        />
                      </div>
                      <div className="person-to-give-permission-basic-information">
                        <p className="person-permission-info">
                          First and last name
                        </p>
                        <p className="person-permission-info">Specialized at</p>
                        <p className="person-permission-info">Phone number</p>
                        <hr />
                        <p className="person-permission-info">Organization</p>
                      </div>
                    </div>
                  </div>

                  <div className="person-to-give-permission-container">
                    <div className="permission-action">
                      <input
                        type="checkbox"
                        name="person-to-give-permission-checkbox"
                        id="person-to-give-permission-checkbox"
                      />
                    </div>

                    <div className="person-to-give-permission-information">
                      <div className="person-to-give-permission-img-container">
                        <img
                          className="person-to-give-permission-img"
                          src={defaultAvatar}
                          alt="Person photo"
                        />
                      </div>
                      <div className="person-to-give-permission-basic-information">
                        <p className="person-permission-info">
                          First and last name
                        </p>
                        <p className="person-permission-info">Specialized at</p>
                        <p className="person-permission-info">Phone number</p>
                        <hr />
                        <p className="person-permission-info">Organization</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="people-to-give-permission-count">
                  Number of persons content is shared with
                </p>
              </div>
              <button
                className="share-btn"
                type="button"
                onClick={() => {
                  console.log("Content is being shared... Loadingg...");
                }}
              >
                Share content
              </button>
            </div>
          </section>
        </section>
      )}

      {isExportOpen && (
        <>
          <section className="export-modal-overlay">
            <section className="export-modal-container">
              <span
                className="share-export-close-modal-btn"
                onClick={() => {
                  dispatch(openExportModal(!isExportOpen));
                  let shareExportContainer = document.querySelector(
                    ".share-export-container"
                  );
                  shareExportContainer.style.display = "flex";
                }}
              >
                X
              </span>
              <div className="export-modal">
                <div className="export-modal-content">
                  <h4>Exporting posts...</h4>
                  <div className="export-modal-files-container">
                    {postsToExport.map((post) => {
                      return (
                        <div className="export-modal-file-wrapper">
                          <p>{post.title}</p>
                        </div>
                      );
                    })}
                  </div>
                  {isExported && (
                    <div className="export-modal-progress-bar">
                      <p>Successfully exported!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </section>
        </>
      )}

      <section className="share-export-main-container share-export-position-out">
        <div className="share-export-container ">
          <section
            className="share-icon-container"
            onClick={() => {
              dispatch(openShareModal(!isShareOpen));
              let shareExportContainer = document.querySelector(
                ".share-export-container"
              );
              shareExportContainer.style.display = "none";
              // alert("Share activated");
            }}
          >
            <FaShare className="share-export-icon" />
          </section>
          <section
            className="export-icon-container"
            onClick={() => {
              // let postsToExport = getSelectedPosts();/
              dispatch(openExportModal(!isExportOpen));
              let shareExportContainer = document.querySelector(
                ".share-export-container"
              );
              shareExportContainer.style.display = "none";
              dispatch(exportToPDF(postsToExport)).then((response) => {
                var arrBuffer = base64ToArrayBuffer(response.payload.data);

                // It is necessary to create a new blob object with mime-type explicitly set
                // otherwise only Chrome works like it should
                var newBlob = new Blob([arrBuffer], {
                  type: "application/pdf",
                });

                // For other browsers:
                // Create a link pointing to the ObjectURL containing the blob.
                var data = window.URL.createObjectURL(newBlob);

                var link = document.createElement("a");
                document.body.appendChild(link); //required in FF, optional for Chrome
                link.href = data;
                link.download = response.payload.fileName;
                link.click();
                window.URL.revokeObjectURL(data);
                link.remove();
              });
            }}
          >
            <FaFileExport className="share-export-icon" />
          </section>
        </div>
      </section>
      <FilterOptions searchPostDto={searchPostDto} />
      <div className="reminder">
        <p className="unselect-data-reminder">
          IMPORTANT: Uncheck all selected post if you want to exit share/export
          mode!!
        </p>
      </div>
      <div className="dashboard-cols">
        <section className="list-of-posts-main-container">
          {posts.map((post) => {
            return <Post key={post.id} {...post} />;
          })}
        </section>

        <section className="pie-graph-main-container">
          <PieGraph searchPostDto={searchPostDto} />
        </section>
      </div>
    </div>
  );
};
