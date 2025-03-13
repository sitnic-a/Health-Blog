import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  hideHoveredContentCounter,
  previewHoveredContentCounter,
} from './redux-toolkit/features/regularUserSlice'

export const SharedContent = () => {
  let dispatch = useDispatch()
  let { sharesPerMentalHealthExpert } = useSelector(
    (store) => store.regularUser
  )
  return (
    sharesPerMentalHealthExpert.length > 0 && (
      <div className="shares-per-mental-health-expert-content-posts">
        {sharesPerMentalHealthExpert.map((expert) => {
          let mentalHealthExpert = expert.mentalHealthExpertContentSharedWith
          let contentSharedWithMentalHealthExpert = expert.sharedContent
          return (
            <div
              className="shares-per-mental-health-expert-expert-main-container"
              key={mentalHealthExpert.id}
              onMouseEnter={(e) => {
                let hoveredContainerObj = {
                  mentalHealthExpertId: mentalHealthExpert.id,
                }
                dispatch(previewHoveredContentCounter(hoveredContainerObj))
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
                  {contentSharedWithMentalHealthExpert.length} post shared!
                </p>
              </Link>
            </div>
          )
        })}
      </div>
    )
  )
}
