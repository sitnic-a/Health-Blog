import { useDispatch } from 'react-redux'
import { requestStatuses } from '../../../../enums/requestStatuses'

import MyExpertsPendingTherapyRequestInvitationCSS from './MyExpertsPendingTherapyRequestInvitation.css'
import {
  changeRequestStatus,
  getMentalHealthExpertsWhoSentUserAnInvitationForTherapy,
} from '../../../../redux-toolkit/features/therapySlice'
import { toast } from 'react-toastify'

export const MyExpertsPendingTherapyRequestInvitation = ({ invitation }) => {
  let dispatch = useDispatch()

  console.log('Invitation ', invitation)
  let mentalHealthExpertFullName = String.prototype.concat(
    invitation?.mentalHealthExpertFirstName,
    ' ',
    invitation?.mentalHealthExpertLastName,
  )
  return (
    <div className="my-mental-health-experts-pending-therapy-requests-invitation-container">
      <div className="my-mental-health-experts-pending-therapy-requests-invitation-header">
        <p className="my-mental-health-experts-pending-therapy-requests-invitation-header-title">
          {mentalHealthExpertFullName} |{' '}
          <span className="my-mental-health-expert-pending-therapy-request-invitation-organization">
            {invitation?.mentalHealthExpertOrganization}
          </span>
        </p>
      </div>
      <div className="my-mental-health-experts-invitation-therapy-request-actions">
        <button
          type="button"
          className="my-mental-health-experts-invitation-therapy-request-action my-mental-health-experts-invitation-therapy-request-accept"
          onClick={() => {
            let authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

            let requestObj = {
              mentalHealthExpertId: invitation?.mentalHealthExpertId,
              mentalHealthExpertUserId: invitation?.mentalHealthExpertUserId,
              regularUserId: invitation?.regularUserId,
              newRequestStatus: requestStatuses.APPROVED,
            }
            let objectWithData = {
              authenticatedUser,
              requestObj,
            }
            dispatch(changeRequestStatus(objectWithData)).then((data) => {
              let statusCode = data?.payload?.statusCode
              if (statusCode === 200) {
                toast.success(
                  `Uspješno ste se povezali sa ${mentalHealthExpertFullName}`,
                  {
                    autoClose: 4000,
                    position: 'bottom-right',
                  },
                )

                let query = {
                  loggedUserId: authenticatedUser?.id,
                  requestStatus: requestStatuses.PENDING,
                  IsMentalHealthExpertInviting: true,
                }
                let objectWithData = {
                  authenticatedUser,
                  query,
                }
                dispatch(
                  getMentalHealthExpertsWhoSentUserAnInvitationForTherapy(
                    objectWithData,
                  ),
                )
              }
            })
          }}
        >
          Prihvati
        </button>
        <button
          type="button"
          className="my-mental-health-experts-invitation-therapy-request-action my-mental-health-experts-invitation-therapy-request-decline"
          onClick={() => {
            let authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

            let requestObj = {
              mentalHealthExpertId: invitation?.mentalHealthExpertId,
              mentalHealthExpertUserId: invitation?.mentalHealthExpertUserId,
              regularUserId: invitation?.regularUserId,
              newRequestStatus: requestStatuses.DECLINED,
            }
            let objectWithData = {
              authenticatedUser,
              requestObj,
            }
            dispatch(changeRequestStatus(objectWithData)).then((data) => {
              let statusCode = data?.payload?.statusCode
              if (statusCode === 200) {
                toast.info(`${mentalHealthExpertFullName} uspješno odbijen`, {
                  autoClose: 4000,
                  position: 'bottom-right',
                })

                let query = {
                  loggedUserId: authenticatedUser?.id,
                  requestStatus: requestStatuses.PENDING,
                  IsMentalHealthExpertInviting: true,
                }
                let objectWithData = {
                  authenticatedUser,
                  query,
                }
                dispatch(
                  getMentalHealthExpertsWhoSentUserAnInvitationForTherapy(
                    objectWithData,
                  ),
                )
              }
            })
          }}
        >
          Odbij
        </button>
      </div>
      <hr />
    </div>
  )
}
