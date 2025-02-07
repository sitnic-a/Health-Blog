import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { shareByLink } from './redux-toolkit/features/shareExportSlice'

import { Loader } from './Loader'
import { ListOfSharedPosts } from './share-export/share/ListOfSharedPosts'
import {
  getRecentShares,
  getSharesPerMentalHealthExpert,
  hideHoveredContentCounter,
  previewHoveredContentCounter,
} from './redux-toolkit/features/regularUserSlice'
import useFetchLocationState from './custom/hooks/useFetchLocationState'
import { formatDateToString } from './utils/helper-methods/methods'

import { FaRegSquareMinus } from 'react-icons/fa6'
import { FaRegSquarePlus } from 'react-icons/fa6'

export const SharedPosts = () => {
  let dispatch = useDispatch()
  let { loggedUser } = useFetchLocationState()

  let { postsToShare, isLoading } = useSelector((store) => store.shareExport)
  let { sharesPerMentalHealthExpert, recentShares } = useSelector(
    (store) => store.regularUser
  )

  useEffect(() => {
    let url = window.location.href
    if (url.includes('share/link')) {
      let urlParts = url.split('/')
      let shareGuid = urlParts[urlParts.length - 1]
      dispatch(shareByLink(shareGuid))
      return
    }
    let query = {
      loggedUserId: loggedUser.id,
    }
    dispatch(getSharesPerMentalHealthExpert(query))
    dispatch(getRecentShares(query))
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      {
        /* Shares via link */
        postsToShare !== null && postsToShare.length > 0 && (
          <section className="user-shared-content">
            <h1>Content:</h1>
            <ListOfSharedPosts />
          </section>
        )
      }
      {
        /* Shares per doctor to make */
        postsToShare.length <= 0 && sharesPerMentalHealthExpert.length > 0 && (
          <section className="shares-per-mental-health-expert-main-container">
            <h1 className="shares-per-mental-health-expert-title">
              Content shared with mental health experts
            </h1>
            <section className="shares-per-mental-health-expert-content-main-container">
              <div className="shares-per-mental-health-expert-content-posts">
                {sharesPerMentalHealthExpert.map((expert) => {
                  let mentalHealthExpert =
                    expert.mentalHealthExpertContentSharedWith
                  let contentSharedWithMentalHealthExpert = expert.sharedContent
                  return (
                    <div
                      className="shares-per-mental-health-expert-expert-main-container"
                      key={mentalHealthExpert.id}
                      onMouseEnter={(e) => {
                        let hoveredContainerObj = {
                          mentalHealthExpertId: mentalHealthExpert.id,
                        }
                        dispatch(
                          previewHoveredContentCounter(hoveredContainerObj)
                        )
                      }}
                      onMouseLeave={(e) => {
                        let hoveredContainerObj = {
                          mentalHealthExpertId: mentalHealthExpert.id,
                        }
                        dispatch(hideHoveredContentCounter(hoveredContainerObj))
                      }}
                    >
                      <input
                        className="input-container-key"
                        type="hidden"
                        data-expert-id={mentalHealthExpert.id}
                      />
                      <p className="shares-per-mental-health-expert-expert-info-paragraph">
                        {mentalHealthExpert.username}
                      </p>
                      <Link
                        className="posts-counter-link"
                        to={'/shared-content-permission'}
                        state={{
                          contentSharedWithMentalHealthExpert:
                            contentSharedWithMentalHealthExpert,
                          mentalHealthExpert: mentalHealthExpert,
                        }}
                      >
                        <p className="posts-counter-paragraph">
                          {contentSharedWithMentalHealthExpert.length} post
                          shared!
                        </p>
                      </Link>
                    </div>
                  )
                })}
              </div>

              {recentShares.length > 0 && (
                <div className="shares-per-mental-health-expert-recent-shares-main-container">
                  <div className="shares-per-mental-health-expert-recent-shares-header">
                    <h2 className="shares-per-mental-health-expert-recent-shares-header-title">
                      Recent posts:
                    </h2>
                  </div>
                  <div className="shares-per-mental-health-expert-recent-shares-container">
                    {recentShares.map((share, index) => {
                      let person = `${share.sharedWith.firstName} ${share.sharedWith.lastName}`
                      let sharedAt = formatDateToString(
                        share.sharedPost.sharedAt
                      )
                      return (
                        <div
                          className="shares-per-mental-health-expert-recent-share-container"
                          key={index}
                        >
                          <div className="shares-per-mental-health-expert-recent-share-title-container">
                            <h1 className="shares-per-mental-health-expert-recent-share-title">
                              {share.sharedPost.title}
                            </h1>
                            <span className="shares-per-mental-health-expert-recent-share-actions-container">
                              <FaRegSquareMinus
                                className="shares-per-mental-health-expert-recent-share-action recent-share-shrink-info-action"
                                onClick={(e) => {
                                  let spanContainer = e.currentTarget.parentNode
                                  let expandAction =
                                    spanContainer.children.item(1)
                                  let recentShareContainer =
                                    e.currentTarget.parentNode.parentNode
                                      .parentNode

                                  let basicInfoContainer =
                                    recentShareContainer.children.item(1)

                                  if (
                                    basicInfoContainer.classList.contains(
                                      'shares-per-mental-health-expert-recent-share-shrink-action-deactivated'
                                    )
                                  ) {
                                    basicInfoContainer.classList.remove(
                                      'shares-per-mental-health-expert-recent-share-shrink-action-deactivated'
                                    )
                                  }

                                  basicInfoContainer.classList.add(
                                    'shares-per-mental-health-expert-recent-share-shrink-action-activated'
                                  )
                                  e.currentTarget.style.display = 'none'
                                  setTimeout(() => {
                                    basicInfoContainer.style.display = 'none'
                                    expandAction.style.display = 'inline'
                                  }, 150)
                                }}
                              />
                              <FaRegSquarePlus
                                className="shares-per-mental-health-expert-recent-share-action recent-share-expand-info-action"
                                onClick={(e) => {
                                  let spanContainer = e.currentTarget.parentNode
                                  let shrinkAction =
                                    spanContainer.children.item(0)
                                  let recentShareContainer =
                                    e.currentTarget.parentNode.parentNode
                                      .parentNode

                                  let basicInfoContainer =
                                    recentShareContainer.children.item(1)

                                  if (
                                    basicInfoContainer.classList.contains(
                                      'shares-per-mental-health-expert-recent-share-shrink-action-activated'
                                    )
                                  ) {
                                    basicInfoContainer.classList.remove(
                                      'shares-per-mental-health-expert-recent-share-shrink-action-activated'
                                    )
                                  }

                                  basicInfoContainer.classList.add(
                                    'shares-per-mental-health-expert-recent-share-shrink-action-deactivated'
                                  )
                                  e.currentTarget.style.display = 'none'
                                  setTimeout(() => {
                                    basicInfoContainer.style.display = 'block'
                                    shrinkAction.style.display = 'inline'
                                  }, 150)
                                }}
                              />
                            </span>
                          </div>
                          <div className="shares-per-mental-health-expert-recent-share-basic-info-container">
                            <p className="shares-per-mental-health-expert-recent-share-basic-info">
                              <b>Content: </b> {share.sharedPost.content}
                            </p>
                            <p className="shares-per-mental-health-expert-recent-share-basic-info">
                              <b>Chosen expert: </b>
                              {person}
                            </p>
                            <p className="shares-per-mental-health-expert-recent-share-basic-info">
                              <b>Share date: </b> {sharedAt}
                            </p>
                          </div>
                          <hr />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          </section>
        )
      }
    </>
  )
}
