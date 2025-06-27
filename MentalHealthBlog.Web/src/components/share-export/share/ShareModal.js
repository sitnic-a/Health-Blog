import { useDispatch, useSelector } from 'react-redux'
import {
  getPeopleToShareContentWith,
  prepareContentToShare,
} from '../../utils/helper-methods/methods'

import {
  shareContent,
  revokeShareContent,
  resetShareLinkUrl,
} from '../../redux-toolkit/features/shareExportSlice'

import {
  openShareModal,
  openShareViaLink,
} from '../../redux-toolkit/features/modalSlice'
import { ExpertsToShareContentWith } from './ExpertsToShareContentWith'

import { IoRemoveCircleOutline } from 'react-icons/io5'
import { ShareViaLink } from './ShareViaLink'
import { toast } from 'react-toastify'

import { ShareModal2 } from '../../ShareModal2'

export const ShareModal = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport } = useSelector((store) => store.shareExport)

  return (
    postsToExport.length > 0 &&
    isShareOpen && (
      <section className="share-modal-overlay">
        <ShareModal2 />

        {/* <section className="share-modal-container">
          <span
            className="share-export-close-modal-btn"
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
              className="share-btn share-btn-experts"
              type="button"
              onClick={async () => {
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
            >
              Share content
            </button>

            <button
              className="share-btn"
              type="button"
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
            <ShareViaLink />
          </div>
        </section> */}
      </section>
    )
  )
}
