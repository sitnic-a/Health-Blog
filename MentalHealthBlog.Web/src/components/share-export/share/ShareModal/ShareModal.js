import { useDispatch, useSelector } from 'react-redux'
import {
  openShareModal,
  openShareViaLink,
} from '../../../../redux-toolkit/features/modalSlice'

import {
  filterSuggestedPossibleToShareWith,
  resetShareLinkUrl,
  shareContent,
} from '../../../../redux-toolkit/features/shareExportSlice'
import { prepareContentToShare } from '../../../../utils/helper-methods/methods'

import { toast } from 'react-toastify'

import { ExpertsToShareContentWith } from '../ExpertsToShareContentWith/ExpertsToShareContentWith'

import { LiaSearchSolid } from 'react-icons/lia'
import { PostsToShare } from '../PostsToShare/PostsToShare'
import { ShareViaLink } from '../ShareViaLink/ShareViaLink'

import ShareModalCSS from './ShareModal.css'

export const ShareModal = () => {
  let dispatch = useDispatch()

  let { authenticatedUser } = useSelector((store) => store.user)
  let { isShareOpen, isShareViaLinkOpen } = useSelector((store) => store.modal)
  let { postsToExport, disabledShareContentAction, isSharingLink } =
    useSelector((store) => store.shareExport)

  return (
    postsToExport?.length > 0 &&
    isShareOpen && (
      <section className="share-modal-container-overlay">
        <section id="share-modal-container">
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
            <p>Podijeli postove...</p>
          </div>

          <PostsToShare />

          <div className="share-modal-action-container">
            <div className="share-modal-filter-container">
              <input
                type="text"
                className="search-by-name-surname-organization"
                onKeyUp={(e) => {
                  let searchCondition = e.target.value
                  dispatch(filterSuggestedPossibleToShareWith(searchCondition))
                }}
                placeholder="Pretraga po imenu ili prezimenu..."
              />
              <button
                className="search-by-name-surname-organization-filter-button"
                type="button"
              >
                Traži
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

                  dispatch(shareContent(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.StatusCode
                    if (statusCode === 400) {
                      toast.error('Nije moguće podijeliti sadržaj!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('Dijeljenje nije uspjelo!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                    }
                  })
                }}
                disabled={disabledShareContentAction}
              >
                Podijeli sadržaj
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
                      toast.error('Nije moguće podijeliti sadržaj!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('Dijeljenje nije uspjelo!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                    }
                  })
                  dispatch(openShareViaLink(!isShareViaLinkOpen))
                }}
              >
                Podijeli putem linka
              </button>
            </div>
          </div>

          <ShareViaLink />

          <ExpertsToShareContentWith />
        </section>
      </section>
    )
  )
}
