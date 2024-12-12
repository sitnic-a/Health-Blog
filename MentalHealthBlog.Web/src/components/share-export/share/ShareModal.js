import { useDispatch, useSelector } from 'react-redux'
import { getPeopleToShareContentWith } from '../../utils/helper-methods/methods'

import {
  shareContent,
  revokeShareContent,
} from '../../redux-toolkit/features/shareExportSlice'

import {
  openShareModal,
  openShareViaLink,
} from '../../redux-toolkit/features/modalSlice'
import { ExpertsToShareContentWith } from './ExpertsToShareContentWith'

import { IoRemoveCircleOutline } from 'react-icons/io5'
import { ShareViaLink } from './ShareViaLink'

export const ShareModal = () => {
  let dispatch = useDispatch()
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport } = useSelector((store) => store.shareExport)

  return (
    postsToExport.length > 0 &&
    isShareOpen && (
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
            <ExpertsToShareContentWith />
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
                  shareLink: false,
                }

                dispatch(shareContent(contentToBeShared))
              }}
            >
              Share content
            </button>
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
                  shareLink: true,
                }

                dispatch(shareContent(contentToBeShared))
                dispatch(openShareViaLink(!isShareViaLinkOpen))
              }}
            >
              Share via link
            </button>
            <ShareViaLink />
          </div>
        </section>
      </section>
    )
  )
}
