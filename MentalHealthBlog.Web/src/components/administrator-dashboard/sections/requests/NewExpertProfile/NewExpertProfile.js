import { MdEmail, MdLocalPhone } from 'react-icons/md'
import { NewExpertProfileActions } from '../NewExpertProfileActions/NewExpertProfileActions'
import defaultPhoto from '../../../../../images/default-avatar.png'
import { stringIsNullOrEmpty } from '../../../../../utils/helper-methods/methods'

import NewExpertProfileCSS from './NewExpertProfile.css'

export const NewExpertProfile = (props) => {
  let expert = props?.expert
  let base64Photo = `data:image/png;base64,${expert?.photoAsFile}`

  return (
    expert && (
      <div className="new-expert-profile-container">
        <div className="new-expert-profile-basic-info">
          <div className="new-expert-profile-img-wrapper">
            <img
              className="new-expert-profile-img"
              src={
                !stringIsNullOrEmpty(expert?.photoAsFile)
                  ? base64Photo
                  : defaultPhoto
              }
              alt={expert?.username}
            />
          </div>
          <div className="new-expert-profile-wrapper">
            <p className="new-expert-profile-username">{expert.username}</p>
          </div>
        </div>

        <div className="new-expert-profile-bio">
          <div className="new-expert-profile-wrapper new-expert-profile-first-name-wrapper">
            <p className="new-expert-profile-bio-info new-expert-profile-first-name">
              First name: <span>{expert?.firstName}</span>
            </p>
          </div>
          <div className="new-expert-profile-wrapper new-expert-profile-last-name-wrapper">
            <p className="new-expert-profile-bio-info new-expert-profile-last-name">
              Last name: <span>{expert?.lastName}</span>
            </p>
          </div>
          <div className="new-expert-profile-wrapper new-expert-profile-organization-wrapper">
            <p className="new-expert-profile-bio-info new-expert-profile-organization">
              Organization: <span>{expert?.organization}</span>
            </p>
          </div>
          <div className="new-expert-profile-wrapper new-expert-profile-phone-number-wrapper">
            <p className="new-expert-profile-bio-info new-expert-profile-phone-number">
              <MdLocalPhone />
              <span>{expert?.phoneNumber}</span>
            </p>
          </div>
          <div className="new-expert-profile-wrapper new-expert-profile-email-wrapper">
            <p className="new-expert-profile-bio-info new-expert-profile-email">
              <MdEmail className="new-expert-profile-email-icon" />
              <span>
                {!stringIsNullOrEmpty(expert?.email) ? expert?.email : '-'}
              </span>
            </p>
          </div>
        </div>
        {expert?.isApproved === false && expert?.isRejected === false && (
          <NewExpertProfileActions expert={expert} />
        )}
      </div>
    )
  )
}
