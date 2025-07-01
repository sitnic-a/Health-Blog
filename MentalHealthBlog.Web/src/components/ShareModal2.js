import { useDispatch, useSelector } from 'react-redux'
import {
  openShareModal,
  openShareViaLink,
} from './redux-toolkit/features/modalSlice'

import {
  resetShareLinkUrl,
  shareContent,
} from './redux-toolkit/features/shareExportSlice'
import { prepareContentToShare } from './utils/helper-methods/methods'

import { toast } from 'react-toastify'

import { ExpertsToShareContentWith2 } from './share-export/share/ExpertsToShareContentWith2'

import { LiaSearchSolid } from 'react-icons/lia'
import { PostsToBeShared } from './share-export/share/PostsToBeShared'
import { ShareViaLink } from './share-export/share/ShareViaLink'

export const ShareModal2 = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport, disabledShareContentAction, isSharingLink } =
    useSelector((store) => store.shareExport)

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

          <PostsToBeShared />

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
              <button
                className="share-content-to-experts share-content-btn"
                onClick={async () => {
                  if (isSharingLink === true) {
                    dispatch(resetShareLinkUrl())
                  }

                  let paramsForPreparation = {
                    postsToExport,
                    shareLink: false,
                  }

                  let contentToBeShared =
                    prepareContentToShare(paramsForPreparation)

                  let objectWithData = {
                    contentToBeShared,
                    authenticatedUser,
                  }

                  console.log('CTBS ', contentToBeShared)

                  dispatch(shareContent(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.StatusCode
                    if (statusCode === 400) {
                      toast.error("Content couldn't be shared!", {
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error("Couldn't find the data!", {
                        position: 'bottom-right',
                      })
                    }
                  })
                }}
                disabled={disabledShareContentAction}
              >
                Share Content
              </button>
              <button
                className="share-content-to-experts"
                onClick={() => {
                  let paramsForPreparation = {
                    postsToExport,
                    shareLink: true,
                  }

                  let contentToBeShared =
                    prepareContentToShare(paramsForPreparation)

                  let objectWithData = {
                    contentToBeShared,
                    authenticatedUser,
                  }

                  dispatch(shareContent(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.StatusCode
                    if (statusCode === 400) {
                      toast.error("Content couldn't be shared!", {
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error("Couldn't find the data!", {
                        position: 'bottom-right',
                      })
                    }
                  })
                  dispatch(openShareViaLink(!isShareViaLinkOpen))
                }}
              >
                Share via link
              </button>
            </div>
          </div>

          <ShareViaLink />

          <ExpertsToShareContentWith2 />
        </section>
      </section>
    )
  )
}
