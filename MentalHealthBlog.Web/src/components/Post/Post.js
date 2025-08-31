import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import {
  setIsSharingExporting,
  setPost,
} from '../../redux-toolkit/features/postSlice'
import { openDeleteModal } from '../../redux-toolkit/features/modalSlice'
import { setOverlayForShareExport } from '../../redux-toolkit/features/shareExportSlice'
import {
  resetSharesPerMentalHealthExpert,
  revokeContentPermission,
} from '../../redux-toolkit/features/regularUserSlice'
import { getSelectedPosts } from '../../utils/helper-methods/methods'

import { showTags, showEmotions } from '../../utils/helper-methods/postHelper'
import { PostTags } from '../PostTags/PostTags'
import { PostEmotions } from '../PostEmotions/PostEmotions'

import { MdOutlineModeEditOutline, MdOutlineDelete } from 'react-icons/md'
import { TiArrowSortedDown } from 'react-icons/ti'
import { GoCircleSlash } from 'react-icons/go'
import { toast } from 'react-toastify'
import { useState } from 'react'

import PostCSS from './Post.css'

export const Post = (props) => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let [isZoomingOut, setIsZoomingOut] = useState(false)
  let post = props?.post
  let mentalHealthExpert = props?.sharedWith

  let { isSharingExporting } = useSelector((store) => store.post)
  let { isReviewingSharedPosts } = useSelector((store) => store.regularUser)
  let { authenticatedUser } = useSelector((store) => store.user)

  //Helpers
  let createdAt = moment(post?.createdAt, 'YYYYMMDDhhmmss').fromNow()
  let sharedAt = moment(post?.sharedAt, 'YYYYMMDDHHmmss').fromNow()

  return (
    <div
      className={`main-container ${
        isReviewingSharedPosts === true ? 'main-single-col' : ''
      }`}
    >
      <section
        className={`post-container ${
          isReviewingSharedPosts === true ? 'post-container-single-col' : ''
        } ${isZoomingOut ? 'zoom' : ''}`}
      >
        <section className="post-container-content">
          <div className="post-header">
            <input type="hidden" data-post-id={post?.id} />
            <h1>{post?.title}</h1>
          </div>
          <div className="post-information">
            <textarea
              className="post-content"
              name="content"
              rows={13}
              value={post?.content}
              disabled={true}
            ></textarea>
          </div>
          <div className="post-date">
            <p>
              Created at: <span>{createdAt}</span>
            </p>
            {isReviewingSharedPosts && (
              <p>
                Shared at: <span>{sharedAt}</span>
              </p>
            )}
          </div>
        </section>

        {isReviewingSharedPosts && (
          <button
            data-action-revoke-permission="revoke-permissiomn"
            className="content-shared-with-mental-health-expert-revoke-action"
          >
            <GoCircleSlash
              onClick={(e) => {
                let objectWithData = {
                  revokeObject: {
                    postId: post?.id,
                    sharedWithId: mentalHealthExpert?.id,
                    loggedUserId: authenticatedUser?.id,
                  },
                  authenticatedUser,
                }

                dispatch(revokeContentPermission(objectWithData)).then(
                  (data) => {
                    let statusCode = data?.payload?.StatusCode

                    if (statusCode !== 200) {
                      if (statusCode === 400) {
                        toast.error("This post doesn't have permission!", {
                          position: 'bottom-right',
                        })
                        return
                      }

                      if (statusCode === 404) {
                        toast.error("Can't revoke permission! Try again!", {
                          autoClose: 1500,
                          position: 'bottom-right',
                        })
                        return
                      }
                    }

                    if (data?.payload?.statusCode === 200) {
                      setIsZoomingOut(true)

                      setTimeout(() => {
                        dispatch(
                          resetSharesPerMentalHealthExpert(data?.payload)
                        )
                      }, 250)

                      toast.success(
                        `This content is no longer visible to ${mentalHealthExpert?.firstName} ${mentalHealthExpert?.lastName}`,
                        {
                          position: 'bottom-right',
                        }
                      )
                    }
                  }
                )
              }}
            />
          </button>
        )}

        {isReviewingSharedPosts || (
          <>
            <button data-action-update="update" type="button">
              <MdOutlineModeEditOutline
                className="post-container-action-icon"
                onClick={() => {
                  dispatch(setPost(post))
                  navigate(`/post/${post?.id}`, {
                    state: {
                      post,
                    },
                  })
                }}
              />
            </button>

            <button data-action-delete="delete" type="button">
              <MdOutlineDelete
                className="post-container-action-icon"
                onClick={() => {
                  dispatch(openDeleteModal(true))
                  dispatch(setPost(post))
                }}
              />
            </button>
          </>
        )}
      </section>

      <>
        <div
          className={`post-overlay ${
            isReviewingSharedPosts === true ? 'post-overlay-single-col' : ''
          } `}
        ></div>
        <input
          type="checkbox"
          name="share-export"
          onChange={() => {
            dispatch(setOverlayForShareExport(authenticatedUser))
            let selectedPosts = getSelectedPosts(authenticatedUser)
            if (selectedPosts?.length <= 0)
              dispatch(setIsSharingExporting(!isSharingExporting))
          }}
        />
      </>

      <div
        className={`post-reveal-action-containers ${
          isReviewingSharedPosts === true
            ? 'post-reveal-action-containers-single-col'
            : ''
        }`}
      >
        <div className="post-tags-reveal-action-main-container">
          <div
            className={`post-tags-reveal-action-container ${
              isReviewingSharedPosts === true
                ? 'post-tags-reveal-action-container-single-col'
                : ''
            }`}
          >
            <p className="post-reveal-option-title">Tags</p>
            <TiArrowSortedDown
              className="post-reveal-expand-button"
              onClick={(e) => {
                showTags(e.currentTarget)
              }}
            />
          </div>
          <PostTags post={post} />
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
          <PostEmotions post={post} />
        </div>
      </div>
    </div>
  )
}
