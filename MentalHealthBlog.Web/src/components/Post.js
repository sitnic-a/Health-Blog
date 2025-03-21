import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  setIsSharingExporting,
  setPost,
  showTags,
  showEmotions,
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
import { TiArrowSortedDown } from 'react-icons/ti'
import { PostEmotions } from './PostEmotions'

export const Post = (props) => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { isDeleteOpen } = useSelector((store) => store.modal)
  let { isSharingExporting } = useSelector((store) => store.post)

  let { authenticatedUser } = useSelector((store) => store.user)

  //Helpers
  let createdAt = formatDateToString(props.createdAt)

  return (
    <div className="main-container">
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
        <button data-action-update="update" type="button">
          <MdOutlineModeEditOutline
            onClick={() => {
              dispatch(setPost(props))
              navigate(`/post/${props.id}`, {
                state: {
                  props,
                },
              })
            }}
          />
        </button>

        <button data-action-delete="delete" type="button">
          <MdOutlineDelete
            onClick={() => {
              dispatch(openDeleteModal(true))
              dispatch(setPost(props))
            }}
          />
          {isDeleteOpen && <DeleteConfirmation />}
        </button>
      </section>
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
          ></Link>
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

      <div className="post-tags-reveal-action-main-container">
        <div className="post-tags-reveal-action-container">
          <p className="post-reveal-option-title">Tags</p>
          <TiArrowSortedDown
            className="post-reveal-expand-button"
            onClick={(e) => {
              dispatch(showTags(e))
            }}
          />
        </div>
        <PostTags post={props} />
      </div>

      <div className="post-emotions-reveal-action-main-container">
        <div className="post-emotions-reveal-action-container">
          <p className="post-reveal-option-title">Emotions</p>
          <TiArrowSortedDown
            className="post-reveal-expand-button"
            onClick={(e) => {
              dispatch(showEmotions(e))
            }}
          />
        </div>
        <PostEmotions post={props} />
      </div>
    </div>
  )
}
