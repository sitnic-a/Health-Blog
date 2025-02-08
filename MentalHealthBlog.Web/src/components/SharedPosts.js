import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { shareByLink } from './redux-toolkit/features/shareExportSlice'
import {
  getRecentShares,
  getSharesPerMentalHealthExpert,
  hideHoveredContentCounter,
  previewHoveredContentCounter,
} from './redux-toolkit/features/regularUserSlice'
import useFetchLocationState from './custom/hooks/useFetchLocationState'

import { Loader } from './Loader'
import { ListOfSharedPosts } from './share-export/share/ListOfSharedPosts'
import { RecentShares } from './RecentShares'

export const SharedPosts = () => {
  let dispatch = useDispatch()
  let { loggedUser } = useFetchLocationState()

  let { postsToShare, isLoading } = useSelector((store) => store.shareExport)
  let { sharesPerMentalHealthExpert } = useSelector(
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

              <RecentShares />
            </section>
          </section>
        )
      }
    </>
  )
}
