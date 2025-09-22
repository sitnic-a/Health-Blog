import { useDispatch } from 'react-redux'
import moment from 'moment'
import { setOverlayPost } from '../../../../redux-toolkit/features/mentalExpertSlice'

import { PostTags } from '../../../PostTags/PostTags'
import { PostEmotions } from '../../../PostEmotions/PostEmotions'

import OverlayPostPreviewCSS from './OverlayPostPreview.css'

export const OverlayPostPreview = (props) => {
  let dispatch = useDispatch()
  let contentPost = props?.content

  let createdAt
  if (contentPost !== null || contentPost !== undefined) {
    createdAt = moment(contentPost?.createdAt).fromNow()
  }

  return (
    contentPost !== null && (
      <div
        className="overlay-post-main-container"
        onClick={(e) => {
          let overlayPost = document.querySelector('.overlay-post-container')
          if (overlayPost.contains(e.target)) {
            return
          } else {
            dispatch(setOverlayPost(null))
          }
        }}
      >
        <div className="overlay-post-container">
          <div
            className="overlay-post-actions"
            onClick={() => {
              dispatch(setOverlayPost(null))
            }}
          >
            <span className="overlay-post-actions-close-modal">X</span>
          </div>
          <div className="overlay-post-content-container">
            <div className="overlay-post-title">
              <h1>{contentPost?.title}</h1>
            </div>
            <div className="overlay-post-content">
              <pre>{contentPost?.content}</pre>
            </div>
            <p className="overlay-post-tags-subtitle">Tagovi: </p>
            <div className="overlay-post-tags-container">
              <PostTags post={contentPost} />
            </div>

            <div className="overlay-post-emotions-container">
              <p className="overlay-post-emotions-subtitle">Emocije: </p>
              <PostEmotions post={contentPost} />
            </div>

            <div className="overlay-post-date-container">
              <p className="overlay-post-date">{createdAt}</p>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
