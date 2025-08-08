import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  hideHoveredContentCounter,
  previewHoveredContentCounter,
  setIsReviewingState,
} from '../redux-toolkit/features/regularUserSlice'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'

import defaultPhoto from '../images/default-avatar.png'

export const SharedContent = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { sharesPerMentalHealthExpert } = useSelector(
    (store) => store.regularUser
  )
  return (
    sharesPerMentalHealthExpert?.length > 0 && (
      <div className="shares-per-mental-health-expert-content-posts">
        {sharesPerMentalHealthExpert.map((expert) => {
          let mentalHealthExpert = expert?.mentalHealthExpertContentSharedWith
          let base64photo = `data:image/png;base64, ${mentalHealthExpert?.photoAsFile}`
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
              <div className="shares-per-mental-health-expert-expert-image-wrapper">
                <img
                  className="shares-per-mental-health-expert-expert-image"
                  src={
                    !stringIsNullOrEmpty(mentalHealthExpert?.photoAsFile)
                      ? base64photo
                      : defaultPhoto
                  }
                  alt="Expert"
                />
              </div>
              <p className="shares-per-mental-health-expert-expert-info-paragraph">
                {mentalHealthExpert?.firstName} {mentalHealthExpert?.lastName}
              </p>
              <p className="shares-per-mental-health-expert-expert-info-paragraph">
                {mentalHealthExpert?.roles[0].name}
              </p>

              <hr className="shares-per-mental-health-expert-separator-line" />

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
