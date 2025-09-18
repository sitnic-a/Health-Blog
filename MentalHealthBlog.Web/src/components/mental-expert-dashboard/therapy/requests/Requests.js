import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import {
  changeRequestStatus,
  getRequestsForMentalHealthExpert,
} from '../../../../redux-toolkit/features/therapySlice'
import { Navbar } from '../../../shared/Navbar/Navbar'

import { requestStatuses } from '../../../../enums/requestStatuses'
import { FaCheck } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

import RequestsCSS from './Requests.css'

export const Requests = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { requestsForMentalHealthExpert } = useSelector((store) => store.therapy)

  console.log('Authenticated user ', authenticatedUser)

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getRequestsForMentalHealthExpert(objectWithData))
  }, [])

  return (
    <section id="therapy-requests-main-container">
      <Navbar />

      {requestsForMentalHealthExpert?.length > 0 && (
        <div className="therapy-requests-container">
          <div className="therapy-requests-requests-container">
            <div className="therapy-requests-requests-content">
              {requestsForMentalHealthExpert?.map((request) => {
                let fullName = `${request?.regularUserFirstName} ${request?.regularUserLastName}`
                let sentAt = moment(request?.sentAt, 'YYYYMMDDHHmmss').fromNow()
                return (
                  <div className="therapy-requests-requests-content-row">
                    <div className="therapy-requests-requests-content-cell">
                      <span className="therapy-request-request-content-cell-value">
                        {fullName}
                      </span>
                    </div>

                    <div className="therapy-requests-requests-content-cell">
                      {request?.requestStatus === requestStatuses.DECLINED ? (
                        <div className="therapy-requests-requests-content-actions-main-container">
                          <p className="therapy-requests-requests-content-actions-description-message">
                            Odbijen
                          </p>
                        </div>
                      ) : (
                        <div className="therapy-requests-requests-content-actions-main-container">
                          {request?.requestStatus ===
                            requestStatuses.APPROVED || (
                            <button
                              className="therapy-requests-request-content-action therapy-request-approve-action"
                              type="button"
                              onClick={() => {
                                let objectWithData = {
                                  authenticatedUser,
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.APPROVED,
                                  userSendingRequest: false,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            >
                              Prihvati
                            </button>
                          )}

                          {request?.requestStatus ===
                            requestStatuses.PENDING && (
                            <FaCheck
                              className="therapy-requests-request-content-action therapy-request-icon-action therapy-request-approve-icon-action"
                              onClick={() => {
                                let objectWithData = {
                                  authenticatedUser,
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.APPROVED,
                                  userSendingRequest: false,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            />
                          )}

                          <button
                            className="therapy-requests-request-content-action therapy-request-decline-action"
                            type="button"
                            onClick={() => {
                              let objectWithData = {
                                authenticatedUser,
                                mentalHealthExpertUserId: authenticatedUser?.id,
                                regularUserId: request?.regularUserId,
                                newRequestStatus: requestStatuses.DECLINED,
                                userSendingRequest: false,
                              }
                              dispatch(changeRequestStatus(objectWithData))
                            }}
                          >
                            Odbij
                          </button>

                          {request?.requestStatus ===
                            requestStatuses.APPROVED && (
                            <button
                              className="therapy-requests-request-content-action therapy-request-stop-sharing-action"
                              type="button"
                              onClick={() => {
                                let objectWithData = {
                                  authenticatedUser,
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.PENDING,
                                  userSendingRequest: false,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            >
                              Zaustavi dijeljenje
                            </button>
                          )}

                          {request?.requestStatus ===
                            requestStatuses.PENDING && (
                            <HiX
                              className="therapy-requests-request-content-action therapy-request-icon-action therapy-request-decline-icon-action"
                              onClick={() => {
                                let objectWithData = {
                                  authenticatedUser,
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.DECLINED,
                                  userSendingRequest: false,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="therapy-requests-requests-content-cell">
                      <span className="therapy-request-request-content-cell-value">
                        {sentAt}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {requestsForMentalHealthExpert?.length <= 0 && (
        <div className="therapy-requests-main-error-container">
          <p className="therapy-requests-main-error-description">
            Nemate novih zahtjeva!
          </p>
        </div>
      )}
    </section>
  )
}
