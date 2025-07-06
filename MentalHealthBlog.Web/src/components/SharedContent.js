import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  hideHoveredContentCounter,
  previewHoveredContentCounter,
  setIsReviewingState,
} from './redux-toolkit/features/regularUserSlice'

export const SharedContent = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

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

              <p
                className="posts-counter-paragraph"
                onClick={() => {
                  dispatch(setIsReviewingState(true))
                  navigate('/shared-content-permission', {
                    state: {
                      mentalHealthExpert: mentalHealthExpert,
                      isReviewingSharedContent: true,
                    },
                  })
                }}
              >
                {contentSharedWithMentalHealthExpert.length} post shared!
              </p>
            </div>
          )
        })}
      </div>
    )
  )
}
