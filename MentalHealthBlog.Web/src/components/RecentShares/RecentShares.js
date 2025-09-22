import { useSelector } from 'react-redux'
import moment from 'moment'
import { returnSharePerMentalHealthExpertRecentShareBasicInfoElements } from '../../utils/helper-methods/methods'

import { FaRegSquareMinus } from 'react-icons/fa6'
import { FaRegSquarePlus } from 'react-icons/fa6'

import RecentSharesCSS from './RecentShares.css'

export const RecentShares = () => {
  let { recentShares } = useSelector((store) => store.regularUser)

  return (
    recentShares?.length > 0 && (
      <div className="shares-per-mental-health-expert-recent-shares-main-container">
        <div className="shares-per-mental-health-expert-recent-shares-header">
          <h2 className="shares-per-mental-health-expert-recent-shares-header-title">
            Nedavno objavljeni postovi:
          </h2>
        </div>
        <div className="shares-per-mental-health-expert-recent-shares-container">
          {recentShares?.map((share, index) => {
            let basicInfoContainerHeight
            let person = `${share?.sharedWith?.firstName} ${share?.sharedWith?.lastName}`
            let createdAt = moment(share?.sharedPost?.createdAt).fromNow()
            let sharedAt = moment(share?.sharedPost?.sharedAt).fromNow()
            return (
              <div
                className="shares-per-mental-health-expert-recent-share-container"
                key={index}
              >
                <div className="shares-per-mental-health-expert-recent-share-title-container">
                  <h1 className="shares-per-mental-health-expert-recent-share-title">
                    {share?.sharedPost?.title}
                  </h1>
                  <span className="shares-per-mental-health-expert-recent-share-actions-container">
                    <FaRegSquareMinus
                      className="shares-per-mental-health-expert-recent-share-action recent-share-shrink-info-action"
                      onClick={(e) => {
                        let { expandAction, basicInfoContainer } =
                          returnSharePerMentalHealthExpertRecentShareBasicInfoElements(
                            e
                          )

                        basicInfoContainerHeight =
                          basicInfoContainer.clientHeight
                        basicInfoContainer.style.height = `0px`
                        basicInfoContainer.style.transition = 'height 150ms'

                        e.currentTarget.style.display = 'none'
                        setTimeout(() => {
                          basicInfoContainer.style.visibility = 'hidden'
                          expandAction.style.display = 'inline'
                        }, 10)
                      }}
                    />
                    <FaRegSquarePlus
                      className="shares-per-mental-health-expert-recent-share-action recent-share-expand-info-action"
                      onClick={(e) => {
                        let { basicInfoContainer, shrinkAction } =
                          returnSharePerMentalHealthExpertRecentShareBasicInfoElements(
                            e
                          )

                        basicInfoContainer.style.height = `${basicInfoContainerHeight}px`
                        basicInfoContainer.style.transition = 'height 150ms'

                        e.currentTarget.style.display = 'none'
                        setTimeout(() => {
                          basicInfoContainer.style.visibility = 'visible'
                          shrinkAction.style.display = 'inline'
                        }, 10)
                      }}
                    />
                  </span>
                </div>
                <div className="shares-per-mental-health-expert-recent-share-basic-info-container">
                  <p className="shares-per-mental-health-expert-recent-share-basic-info">
                    {share?.sharedPost?.content}
                  </p>
                  <div className="shares-per-mental-health-expert-recent-share-basic-info-about-share-container">
                    <p className="shares-per-mental-health-expert-recent-share-basic-info">
                      <b>Podijeljeno sa: </b> {person}
                    </p>
                    <p className="shares-per-mental-health-expert-recent-share-basic-info">
                      <b>Podijeljeno: </b> {sharedAt}
                    </p>
                    <p className="shares-per-mental-health-expert-recent-share-basic-info">
                      <b>Kreirano: </b> {createdAt}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  )
}
