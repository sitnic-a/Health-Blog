import {
  changeRequestStatus,
  setExperts,
} from '../../../redux-toolkit/features/therapySlice'
import { MdPhone, MdEmail } from 'react-icons/md'

import MyMentalHealthExpertProfileCSS from './MyMentalHealthExpertProfile.css'
import { useDispatch, useSelector } from 'react-redux'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'

import { requestStatuses } from '../../../enums/requestStatuses'

export const MyMentalHealthExpertProfile = (props) => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let expert = props?.expert
  return (
    <div className="my-expert-main-container">
      <div className="my-expert-container">
        <div className="my-expert-photo-container">
          <img
            className="my-expert-photo"
            src={`data:image/png;base64,${expert?.mentalHealthExpertPhotoAsFile}`}
            alt={`{${expert?.mentalHealthExpertFirstName} ${expert?.mentalHealthExpertLastName}}`}
          />
        </div>

        <div className="my-expert-field my-expert-username-field">
          <p className="my-expert-username-field-value">
            {expert?.mentalHealthExpertUsername}
          </p>
        </div>

        <div className="my-expert-additional-information-container">
          <div className="my-expert-field-container">
            <span className="my-expert-field">First Name: </span>
            <p
              className="my-expert-field-value my-expert-first-name-value"
              title={expert?.mentalHealthExpertFirstName}
            >
              {expert?.mentalHealthExpertFirstName}
            </p>
          </div>

          <div className="my-expert-field-container">
            <span className="my-expert-field">Last Name: </span>
            <p
              className="my-expert-field-value my-expert-last-name-value"
              title={expert?.mentalHealthExpertLastName}
            >
              {expert?.mentalHealthExpertLastName}
            </p>
          </div>

          <div className="my-expert-field-container">
            <span className="my-expert-field">Organization: </span>
            <p
              className="my-expert-field-value my-expert-organization-value"
              title={expert?.mentalHealthExpertOrganization}
            >
              {expert?.mentalHealthExpertOrganization}
            </p>
          </div>

          <div className="my-expert-field-container">
            <span className="my-expert-field">
              <MdPhone />{' '}
            </span>
            <p
              className="my-expert-field-value"
              title={expert?.mentalHealthExpertPhoneNumber}
            >
              {expert?.mentalHealthExpertPhoneNumber}
            </p>
          </div>

          <div className="my-expert-field-container">
            <span className="my-expert-field">
              <MdEmail />
            </span>
            <p
              className="my-expert-field-value my-expert-email-value"
              title={expert?.mentalHealthExpertEmail}
            >
              {expert?.mentalHealthExpertEmail}
            </p>
          </div>
        </div>

        <div className="my-expert-actions">
          <button
            className="my-expert-stop-sharing-action"
            onClick={() => {
              let objectWithData = {
                mentalHealthExpertId: expert?.mentalHealthExpertId,
                regularUserId: authenticatedUser?.id,
                newRequestStatus: requestStatuses.UNDEFINED,
                authenticatedUser,
              }
              dispatch(changeRequestStatus(objectWithData)).then((data) => {
                let statusCode = data?.payload?.statusCode
                if (statusCode === 200) {
                  let myMentalHealthExperts = data?.payload
                  dispatch(setExperts(myMentalHealthExperts))
                  objectWithData = {
                    authenticatedUser,
                  }
                  dispatch(getMentalHealthExperts(objectWithData))
                }
              })
            }}
          >
            STOP SHARING
          </button>
        </div>
      </div>
    </div>
  )
}
