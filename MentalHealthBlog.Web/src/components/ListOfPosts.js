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
import { GrDocumentPdf } from 'react-icons/gr'
import {
  base64ToArrayBuffer,
  getSelectedPosts,
} from './utils/helper-methods/methods'
import { openExportModal } from './redux-toolkit/features/modalSlice'
import { exportToPDF } from './redux-toolkit/features/shareExportSlice'

export const ListOfPosts = () => {
  let dispatch = useDispatch()
  let { isLoading, posts } = useSelector((store) => store.post)
  let { isLogging, isAuthenticated } = useSelector((store) => store.user)
  let { isExportOpen } = useSelector((store) => store.modal)
  let { postsToExport, isExported, exportedDocument } = useSelector(
    (store) => store.shareExport
  )

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

      {isExportOpen && (
        <>
          <section className="export-modal-overlay">
            <section className="export-modal-container">
              <span
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
              alert('Share activated')
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
                var newBlob = new Blob([arrBuffer], { type: 'application/pdf' })

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
