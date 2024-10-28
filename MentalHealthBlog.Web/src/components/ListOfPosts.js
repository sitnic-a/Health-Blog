import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts } from './redux-toolkit/features/postSlice'

import { Post } from './Post'
import { ListOfPostsHeader } from './ListOfPostsHeader'
import { Loader } from './Loader'
import { PieGraph } from './PieGraph'

import { FilterOptions } from './FilterOptions'

import { toast } from 'react-toastify'

import { FaShare } from 'react-icons/fa'
import { FaFileExport } from 'react-icons/fa'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { LiaSearchSolid } from 'react-icons/lia'
import { IoPersonOutline } from 'react-icons/io5'

import { setIsSharingExporting } from './redux-toolkit/features/postSlice'

import {
  base64ToArrayBuffer,
  getPeopleToShareContentWith,
  getSelectedPosts,
} from './utils/helper-methods/methods'
import {
  openExportModal,
  openShareModal,
} from './redux-toolkit/features/modalSlice'
import {
  exportToPDF,
  getExpertsAndRelatives,
  setOverlayForShareExport,
  shareContent,
  revokeShareContent,
} from './redux-toolkit/features/shareExportSlice'

import defaultAvatar from '../images/default-avatar.png'
import { application } from '../application'

export const ListOfPosts = () => {
  console.log(defaultAvatar)

  let dispatch = useDispatch()
  let { isLoading, posts, isSharingExporting } = useSelector(
    (store) => store.post
  )
  let { isLogging, isAuthenticated } = useSelector((store) => store.user)
  let { isExportOpen, isShareOpen } = useSelector((store) => store.modal)
  let { postsToExport, isExported, exportedDocument, possibleToShareWith } =
    useSelector((store) => store.shareExport)

  let { statisticsLoading } = useSelector((store) => store.pie)

  let location = useLocation()
  let loggedUser = location.state.loggedUser

  let searchPostDto = {
    loggedUser,
    monthOfPostCreation: 0,
  }

  useEffect(() => {
    let prevUrl = location.state.prevUrl

    if (isAuthenticated === true && prevUrl.includes('login')) {
      toast.success('Succesfully logged in', {
        autoClose: 1500,
        position: 'bottom-right',
      })
    }
    dispatch(getPosts(searchPostDto))
  }, [])

  if (isLoading && isLogging && statisticsLoading) {
    ;<Loader />
  }

  return (
    <div className="dashboard">
      <ListOfPostsHeader />

      {postsToExport.length > 0 && isShareOpen && (
        <section className="share-modal-overlay">
          <section className="share-modal-container">
            <span
              className="share-export-close-modal-btn"
              onClick={() => {
                dispatch(openShareModal(!isShareOpen))
                let shareExportContainer = document.querySelector(
                  '.share-export-container'
                )
                shareExportContainer.style.display = 'flex'
              }}
            >
              X
            </span>

            <h4>Share posts...</h4>
            <div className="share-posts-container">
              {/* Array of selected posts */}

              {postsToExport.map((post) => {
                return (
                  <div className="share-post-container" key={post.id}>
                    <p className="share-post-title">{post.title}</p>
                    <span
                      className="revoke-btn"
                      onClick={() => {
                        dispatch(revokeShareContent(post.id))
                      }}
                    >
                      <IoRemoveCircleOutline />
                    </span>
                  </div>
                )
              })}
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
                  {possibleToShareWith.map((personToShareWith) => {
                    return (
                      <div className="person-to-give-permission-container">
                        <div className="permission-action">
                          <input
                            type="checkbox"
                            name="person-to-give-permission-checkbox"
                            id="person-to-give-permission-checkbox"
                            onClick={() => getPeopleToShareContentWith()}
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
                            <input
                              type="hidden"
                              name="person-permission-info"
                              className="person-permission-info info-id"
                              value={personToShareWith.id}
                            />
                            <p
                              className="person-permission-info info-username"
                              title={personToShareWith.username}
                            >
                              {personToShareWith.username}
                            </p>
                            <p
                              className="person-permission-info info-role"
                              title={personToShareWith.roles[0].name}
                            >
                              {personToShareWith.roles[0].name}
                            </p>
                            <p
                              className="person-permission-info info-phoneNumber"
                              title={personToShareWith.phoneNumber}
                            >
                              {personToShareWith.phoneNumber}
                            </p>
                            <hr />
                            <p
                              className="person-permission-info info-organization"
                              title={personToShareWith.organization}
                            >
                              {personToShareWith.organization}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="people-to-give-permission-count">
                  Number of persons content is shared with
                </p>
              </div>
              <button
                className="share-btn"
                type="button"
                onClick={() => {
                  let postsToShareIds = postsToExport.map((post) => post.id)
                  let shareContentWithIds = getPeopleToShareContentWith()

                  let contentToBeShared = {
                    postIds: postsToShareIds,
                    sharedWithIds: shareContentWithIds,
                    sharedAt: new Date(),
                  }

                  dispatch(shareContent(contentToBeShared))
                  // dispatch(openShareModal(!isShareOpen))
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
                  dispatch(openExportModal(!isExportOpen))
                  let shareExportContainer = document.querySelector(
                    '.share-export-container'
                  )
                  shareExportContainer.style.display = 'flex'
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
                      )
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
              dispatch(openShareModal(!isShareOpen))
              let shareExportContainer = document.querySelector(
                '.share-export-container'
              )
              shareExportContainer.style.display = 'none'
              dispatch(getExpertsAndRelatives())
              let selectedPosts = getSelectedPosts(loggedUser)
              console.log('In LIST on Share ', selectedPosts)

              // alert("Share activated");
            }}
          >
            <FaShare className="share-export-icon" />
          </section>
          <section
            className="export-icon-container"
            onClick={() => {
              // let postsToExport = getSelectedPosts();/
              dispatch(openExportModal(!isExportOpen))
              let shareExportContainer = document.querySelector(
                '.share-export-container'
              )
              shareExportContainer.style.display = 'none'
              dispatch(exportToPDF(postsToExport)).then((response) => {
                var arrBuffer = base64ToArrayBuffer(response.payload.data)

                // It is necessary to create a new blob object with mime-type explicitly set
                // otherwise only Chrome works like it should
                var newBlob = new Blob([arrBuffer], {
                  type: 'application/pdf',
                })

                // For other browsers:
                // Create a link pointing to the ObjectURL containing the blob.
                var data = window.URL.createObjectURL(newBlob)

                var link = document.createElement('a')
                document.body.appendChild(link) //required in FF, optional for Chrome
                link.href = data
                link.download = response.payload.fileName
                link.click()
                window.URL.revokeObjectURL(data)
                link.remove()
              })
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
            return <Post key={post.id} {...post} />
          })}
        </section>

        <section className="pie-graph-main-container">
          <PieGraph searchPostDto={searchPostDto} />
        </section>
      </div>
    </div>
  )
}
