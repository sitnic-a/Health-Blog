import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import useFetchLocationState from './custom/hooks/useFetchLocationState'
import {
  setIsSharingExporting,
  setPost,
} from './redux-toolkit/features/postSlice'
import { openDeleteModal } from './redux-toolkit/features/modalSlice'
import { setOverlayForShareExport } from './redux-toolkit/features/shareExportSlice'
import {
  formatDateToString,
  getSelectedPosts,
} from './utils/helper-methods/methods'
import { PostTags } from './PostTags'

import { DeleteConfirmation } from './DeleteConfirmation'
import { MdOutlineModeEditOutline, MdOutlineDelete } from 'react-icons/md'

export const Post = (props) => {
  let dispatch = useDispatch()
  let { isDeleteOpen } = useSelector((store) => store.modal)
  let { isSharingExporting } = useSelector((store) => store.post)

  // let { loggedUser } = useFetchLocationState();
  let { authenticatedUser } = useSelector((store) => store.user)

  //Helpers
  let createdAt = formatDateToString(props.createdAt)

  return (
    <div className="main-container">
      <Link
        onClick={() => {
          dispatch(setPost(props))
        }}
        to={`post/${props.id}`}
        state={{
          // loggedUser: authenticatedUser,
          prevUrl: window.location.href,
        }}
      >
        <section className="post-container">
          <section className="post-container-content">
            <div className="post-header">
              <input type="hidden" data-post-id={props.id} />
              <h1>{props.title}</h1>
            </div>
            <div className="post-information">
              <textarea
                className="post-content"
                name="content"
                rows={13}
                value={props.content}
                disabled={true}
              ></textarea>
            </div>
            <div className="post-date">
              <p>
                Created at: <span>{createdAt}</span>
              </p>
            </div>
          </section>
        </section>
      </Link>
      {isSharingExporting === false && (
        <>
          <Link
            to={`/post/${props.id}`}
            state={{
              postTitle: props.title,
              postContent: props.content,
              postUserId: props.userId,
              loggedUser: authenticatedUser,
            }}
          >
            <button data-action-update="update" type="button">
              <MdOutlineModeEditOutline
                onClick={() => dispatch(setPost(props))}
              />
            </button>
          </Link>
          <button data-action-delete="delete" type="button">
            <MdOutlineDelete
              onClick={() => {
                dispatch(openDeleteModal(true))
                dispatch(setPost(props))
              }}
            />
            {isDeleteOpen && <DeleteConfirmation />}
          </button>
        </>
      )}
      {isSharingExporting === true && (
        <>
          <div className="post-overlay"></div>
          <input
            type="checkbox"
            name="share-export"
            id="share-export"
            onChange={() => {
              dispatch(setOverlayForShareExport(authenticatedUser))
              let selectedPosts = getSelectedPosts(authenticatedUser)
              if (selectedPosts.length <= 0)
                dispatch(setIsSharingExporting(!isSharingExporting))
            }}
          />
        </>
      )}

      <PostTags post={props} />
    </div>
  )
}
