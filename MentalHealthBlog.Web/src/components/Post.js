import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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

import { showTags, showEmotions } from './utils/helper-methods/postHelper'
import { PostTags } from './PostTags'
import { PostEmotions } from './PostEmotions'
import { DeleteConfirmation } from './DeleteConfirmation'

import { MdOutlineModeEditOutline, MdOutlineDelete } from 'react-icons/md'
import { TiArrowSortedDown } from 'react-icons/ti'

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

      <>
        <div className="post-overlay"></div>
        <input
          type="checkbox"
          name="share-export"
          onChange={() => {
            dispatch(setOverlayForShareExport(authenticatedUser))
            let selectedPosts = getSelectedPosts(authenticatedUser)
            if (selectedPosts.length <= 0)
              dispatch(setIsSharingExporting(!isSharingExporting))
          }}
        />
      </>

      <div className="post-reveal-action-containers">
        <div className="post-tags-reveal-action-main-container">
          <div className="post-tags-reveal-action-container">
            <p className="post-reveal-option-title">Tags</p>
            <TiArrowSortedDown
              className="post-reveal-expand-button"
              onClick={(e) => {
                showTags(e.currentTarget)
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
                showEmotions(e.currentTarget)
              }}
            />
          </div>
          <PostEmotions post={props} />
        </div>
      </div>
    </div>
  )
}
