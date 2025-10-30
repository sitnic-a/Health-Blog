import {
  changeRequestStatus,
  setExperts,
  setStopSharingObject,
} from '../../../redux-toolkit/features/therapySlice'
import { MdPhone, MdEmail } from 'react-icons/md'

import MyMentalHealthExpertProfileCSS from './MyMentalHealthExpertProfile.css'
import { useDispatch, useSelector } from 'react-redux'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'

import { requestStatuses } from '../../../enums/requestStatuses'
import { openStopSharing } from '../../../redux-toolkit/features/modalSlice'
import { StopSharingConfirmation } from '../../StopSharingConfirmation/StopSharingConfirmation'

import defaultAvatar from '../../../images/default-avatar.png'
import { stringIsNullOrEmpty } from '../../../utils/helper-methods/methods'

export const MyMentalHealthExpertProfile = (props) => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { isStopSharingOpen } = useSelector((store) => store.modal)
  let expert = props?.expert

  let expertPhoto = `data:image/png;base64,${expert?.mentalHealthExpertPhotoAsFile}`
  return (
    <>
      <StopSharingConfirmation />
      <div className="my-expert-main-container">
        <div className="my-expert-container">
          <div className="my-expert-photo-container">
            <img
              className="my-expert-photo"
              src={
                !stringIsNullOrEmpty(expert?.mentalHealthExpertPhotoAsFile)
                  ? expertPhoto
                  : defaultAvatar
              }
              alt={`${expert?.mentalHealthExpertFirstName} ${expert?.mentalHealthExpertLastName}`}
            />
          </div>

          <div className="my-expert-field my-expert-username-field">
            <p className="my-expert-username-field-value">
              {expert?.mentalHealthExpertUsername}
            </p>
          </div>

          <div className="my-expert-additional-information-container">
            <div className="my-expert-field-container">
              <span className="my-expert-field">Ime: </span>
              <p
                className="my-expert-field-value my-expert-first-name-value"
                title={expert?.mentalHealthExpertFirstName}
              >
                {expert?.mentalHealthExpertFirstName}
              </p>
            </div>

            <div className="my-expert-field-container">
              <span className="my-expert-field">Prezime: </span>
              <p
                className="my-expert-field-value my-expert-last-name-value"
                title={expert?.mentalHealthExpertLastName}
              >
                {expert?.mentalHealthExpertLastName}
              </p>
            </div>

            <div className="my-expert-field-container">
              <span className="my-expert-field">Organizacija: </span>
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

            <div className="my-expert-field-container my-experts-field-email-container">
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
                dispatch(openStopSharing(!isStopSharingOpen))
                let objectWithData = {
                  mentalHealthExpertId: expert?.mentalHealthExpertId,
                  mentalHealthExpertUserId: expert?.mentalHealthExpertUserId,
                  regularUserId: authenticatedUser?.id,
                  newRequestStatus: requestStatuses.UNDEFINED,
                  userSendingRequest: false,
                  authenticatedUser,
                }
                dispatch(setStopSharingObject(objectWithData))
              }}
            >
              ZAUSTAVI DIJELJENJE
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
