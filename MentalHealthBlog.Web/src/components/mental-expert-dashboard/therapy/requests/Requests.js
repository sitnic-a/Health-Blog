import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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
  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { requestsForMentalHealthExpert } = useSelector((store) => store.therapy)

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
              {requestsForMentalHealthExpert?.map((request, index) => {
                console.log('Request ', request)

                let fullName = `${request?.regularUserFirstName} ${request?.regularUserLastName}`
                let sentAt = moment(request?.sentAt).fromNow()
                return (
                  <div
                    key={index}
                    className="therapy-requests-requests-content-row"
                  >
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
                            requestStatuses.APPROVED ||
                            request?.isMentalHealthExpertInviting === true || (
                              <button
                                className="therapy-requests-request-content-action therapy-request-approve-action"
                                type="button"
                                onClick={() => {
                                  authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage,
                                  )
                                  let requestObj = {
                                    mentalHealthExpertUserId:
                                      authenticatedUser?.id,
                                    regularUserId: request?.regularUserId,
                                    newRequestStatus: requestStatuses.APPROVED,
                                    userSendingRequest: false,
                                  }

                                  let objectWithData = {
                                    authenticatedUser,
                                    requestObj,
                                  }
                                  dispatch(changeRequestStatus(objectWithData))
                                }}
                              >
                                Prihvati
                              </button>
                            )}

                          {request?.requestStatus === requestStatuses.PENDING &&
                            request?.isMentalHealthExpertInviting === false && (
                              <FaCheck
                                className="therapy-requests-request-content-action therapy-request-icon-action therapy-request-approve-icon-action"
                                onClick={() => {
                                  authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage,
                                  )
                                  let requestObj = {
                                    mentalHealthExpertUserId:
                                      authenticatedUser?.id,
                                    regularUserId: request?.regularUserId,
                                    newRequestStatus: requestStatuses.APPROVED,
                                    userSendingRequest: false,
                                  }

                                  let objectWithData = {
                                    authenticatedUser,
                                    requestObj,
                                  }
                                  dispatch(changeRequestStatus(objectWithData))
                                }}
                              />
                            )}

                          {request?.isMentalHealthExpertInviting === false && (
                            <button
                              className="therapy-requests-request-content-action therapy-request-decline-action"
                              type="button"
                              onClick={() => {
                                authenticatedUserLocalStorage =
                                  localStorage.getItem('authenticatedUser')
                                authenticatedUser = JSON.parse(
                                  authenticatedUserLocalStorage,
                                )
                                let requestObj = {
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.DECLINED,
                                  userSendingRequest: false,
                                }

                                let objectWithData = {
                                  authenticatedUser,
                                  requestObj,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            >
                              Odbij
                            </button>
                          )}

                          {request?.isMentalHealthExpertInviting === true &&
                            request?.requestStatus ===
                              requestStatuses.PENDING && (
                              <button
                                className="therapy-requests-request-content-action therapy-request-decline-action"
                                type="button"
                                onClick={() => {
                                  let authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  let authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage,
                                  )

                                  let requestObj = {
                                    mentalHealthExpertUserId:
                                      authenticatedUser?.id,
                                    regularUserId: request?.regularUserId,
                                    newRequestStatus: requestStatuses.UNDEFINED,
                                    userSendingRequest: false,
                                    isMentalHealthExpertInvitingRegularUser: true,
                                  }

                                  let objectWithData = {
                                    authenticatedUser,
                                    requestObj,
                                  }

                                  dispatch(
                                    changeRequestStatus(objectWithData),
                                  ).then((data) => {
                                    let statusCode = data?.payload?.statusCode
                                    if (statusCode === 200) {
                                      toast.success(
                                        'Uspješno ste otkazali poslani zahtjev',
                                        {
                                          autoClose: 4000,
                                          position: 'bottom-right',
                                        },
                                      )
                                      return
                                    }
                                  })
                                }}
                              >
                                Otkažite zahtjev
                              </button>
                            )}

                          {request?.requestStatus ===
                            requestStatuses.APPROVED && (
                            <button
                              className="therapy-requests-request-content-action therapy-request-stop-sharing-action"
                              type="button"
                              onClick={() => {
                                authenticatedUserLocalStorage =
                                  localStorage.getItem('authenticatedUser')
                                authenticatedUser = JSON.parse(
                                  authenticatedUserLocalStorage,
                                )
                                let requestObj = {
                                  mentalHealthExpertUserId:
                                    authenticatedUser?.id,
                                  regularUserId: request?.regularUserId,
                                  newRequestStatus: requestStatuses.DECLINED,
                                  userSendingRequest: false,
                                }

                                let objectWithData = {
                                  authenticatedUser,
                                  requestObj,
                                }
                                dispatch(changeRequestStatus(objectWithData))
                              }}
                            >
                              Zaustavi dijeljenje
                            </button>
                          )}

                          {request?.requestStatus === requestStatuses.PENDING &&
                            request?.isMentalHealthExpertInviting === false && (
                              <HiX
                                className="therapy-requests-request-content-action therapy-request-icon-action therapy-request-decline-icon-action"
                                onClick={() => {
                                  authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage,
                                  )
                                  let requestObj = {
                                    mentalHealthExpertUserId:
                                      authenticatedUser?.id,
                                    regularUserId: request?.regularUserId,
                                    newRequestStatus: requestStatuses.DECLINED,
                                    userSendingRequest: false,
                                  }
                                  let objectWithData = {
                                    authenticatedUser,
                                    requestObj,
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
