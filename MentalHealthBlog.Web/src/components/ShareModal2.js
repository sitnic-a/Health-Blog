import { useDispatch, useSelector } from 'react-redux'
import {
  openShareModal,
  openShareViaLink,
} from './redux-toolkit/features/modalSlice'

import { resetShareLinkUrl } from './redux-toolkit/features/shareExportSlice'
import { ExpertsToShareContentWith2 } from './share-export/share/ExpertsToShareContentWith2'

import { LiaSearchSolid } from 'react-icons/lia'
export const ShareModal2 = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport, possibleToShareWith } = useSelector(
    (store) => store.shareExport
  )

  return (
    postsToExport.length > 0 &&
    isShareOpen && (
      <section className="share-modal-container-2-overlay">
        <section id="share-modal-container-2">
          <span
            className="share-modal-close-modal-btn"
            onClick={() => {
              dispatch(openShareModal(!isShareOpen))
              dispatch(openShareViaLink(!isShareViaLinkOpen))
              dispatch(resetShareLinkUrl())
              let shareExportContainer = document.querySelector(
                '.share-export-container'
              )
              shareExportContainer.style.display = 'flex'
            }}
          >
            X
          </span>

          <div className="share-modal-header">
            <p>Share posts...</p>
          </div>

          <div className="share-modal-posts-to-share-container">
            <div className="share-modal-posts-to-share">
              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>

              <div className="share-modal-post-to-share-container">
                <p className="share-modal-post-to-share-title">Test post 1</p>
                <span className="share-modal-post-to-share-remove-from-list">
                  X
                </span>
              </div>
            </div>
          </div>

          <div className="share-modal-action-container">
            <div className="share-modal-filter-container">
              <input
                type="text"
                className="search-by-name-surname-organization"
              />
              <button
                className="search-by-name-surname-organization-filter-button"
                type="button"
              >
                Search
                <LiaSearchSolid className="search-by-name-surname-organization-filter-icon" />
              </button>
            </div>

            <div className="share-modal-share-actions">
              <button className="share-content-to-experts" disabled>
                Share Content
              </button>
              <button className="share-content-to-experts">
                Share via link
              </button>
            </div>
          </div>

          <ExpertsToShareContentWith2 />
        </section>
      </section>
    )
  )
}
