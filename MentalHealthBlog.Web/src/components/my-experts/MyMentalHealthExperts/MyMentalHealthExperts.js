import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'
import { getMyExperts } from '../../../redux-toolkit/features/therapySlice'
import {
  setActiveMyMentalHealthExpertFilterActionTab,
  stringIsNullOrEmpty,
} from '../../../utils/helper-methods/methods'
import { requestStatuses } from '../../../enums/requestStatuses'
import { MyMentalHealthExpertPocket } from '../MyMentalHealthExpertPocket/MyMentalHealthExpertPocket'
import { MentalHealthExpertsDropdown } from '../../MentalHealthExpertsDropdown/MentalHealthExpertsDropdown'
import { MyMentalHealthExpertProfile } from '../MyMentalHealthExpertProfile/MyMentalHealthExpertProfile'
import { Navbar } from '../../shared/Navbar/Navbar'
import { MyExpertsPendingTherapyRequestsInvitations } from '../MyExpertsPendingTherapyRequestsInvitations/MyExpertsPendingTherapyRequestsInvitations'

import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner'

import { TiArrowSortedDown } from 'react-icons/ti'

import MyMentalHealthExpertsCSS from './MyMentalHealthExperts.css'

export const MyMentalHealthExperts = () => {
  let dispatch = useDispatch()
  let { isLoadingExperts } = useSelector((store) => store.mentalExpert)
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let {
    myApprovedOrPendingMentalHealthExperts,
    myPendingMentalHealthExpertWhoSentAnInvitationForTherapy,
  } = useSelector((store) => store.therapy)

  let myApprovedOrPendingRequests =
    myApprovedOrPendingMentalHealthExperts?.filter(
      (tr) =>
        tr.requestStatus === requestStatuses.APPROVED ||
        tr.requestStatus === requestStatuses.PENDING,
    )

  let myApprovedRequests = myApprovedOrPendingMentalHealthExperts?.filter(
    (tr) => tr?.requestStatus === requestStatuses.APPROVED,
  )

  useEffect(() => {
    let pendingTherapyRequestInvitationIndicator = document.querySelector(
      '.pending-therapy-request-invitation-indicator',
    )

    if (!stringIsNullOrEmpty(pendingTherapyRequestInvitationIndicator)) {
      pendingTherapyRequestInvitationIndicator.classList.add(
        'pending-therapy-request-invitation-indicator-hidden',
      )
    }

    let objectWithData = {
      authenticatedUser,
      loggedUserId: authenticatedUser?.id,
    }
    dispatch(getMyExperts(objectWithData))
    dispatch(getMentalHealthExperts(objectWithData))
  }, [])

  return (
    <section id="my-mental-health-experts-main-container">
      <Navbar />

      <div className="my-mental-health-experts-filter-main-container">
        {/* <button
          className="my-mental-health-experts-filter-action my-mental-health-filter-current-action"
          type="button"
          onClick={(e) => {
            setActiveMyMentalHealthExpertFilterActionTab(e)
          }}
        >
          Current
        </button>
        <button
          className="my-mental-health-experts-filter-action my-mental-health-filter-past-action"
          type="button"
          onClick={(e) => {
            setActiveMyMentalHealthExpertFilterActionTab(e)
          }}
        >
          Past
        </button>
        <button
          className="my-mental-health-experts-filter-action my-mental-health-experts-filter-all-action my-mental-health-experts-active-filter"
          type="button"
          onClick={(e) => {
            setActiveMyMentalHealthExpertFilterActionTab(e)
          }}
        >
          All
        </button> */}

        {myApprovedOrPendingMentalHealthExperts?.filter(
          (mhe) =>
            (mhe.regularUserId === authenticatedUser?.id &&
              myApprovedOrPendingRequests?.length >= 2 &&
              mhe.requestStatus === requestStatuses.APPROVED) ||
            mhe.requestStatus === requestStatuses.PENDING,
        )?.length >= 2 || (
          <div className="my-mental-health-filter-choose-action-main-container">
            {isLoadingExperts ? (
              <LoadingSpinner />
            ) : (
              <>
                <button
                  className="my-mental-health-experts-filter-action my-mental-health-filter-choose-action"
                  type="button"
                  onClick={() => {
                    let mainMentalHealthExpertPicker = document.getElementById(
                      'main-mental-health-expert-picker',
                    )

                    let expandIcon = document.querySelector(
                      '.my-mental-health-filter-choose-action-icon',
                    )

                    if (
                      mainMentalHealthExpertPicker.classList.contains(
                        'main-mental-health-expert-picker-shrinked',
                      )
                    ) {
                      mainMentalHealthExpertPicker.classList.remove(
                        'main-mental-health-expert-picker-shrinked',
                      )
                      mainMentalHealthExpertPicker.classList.add(
                        'main-mental-health-expert-picker-expanded',
                      )

                      expandIcon.classList.remove(
                        'my-mental-health-filter-choose-action-icon-expand',
                      )
                      expandIcon.classList.add(
                        'my-mental-health-filter-choose-action-icon-shrink',
                      )
                      return
                    }

                    if (
                      mainMentalHealthExpertPicker.classList.contains(
                        'main-mental-health-expert-picker-expanded',
                      )
                    ) {
                      mainMentalHealthExpertPicker.classList.remove(
                        'main-mental-health-expert-picker-expanded',
                      )
                      mainMentalHealthExpertPicker.classList.add(
                        'main-mental-health-expert-picker-shrinked',
                      )

                      expandIcon.classList.remove(
                        'my-mental-health-filter-choose-action-icon-shrink',
                      )
                      expandIcon.classList.add(
                        'my-mental-health-filter-choose-action-icon-expand',
                      )
                    }
                  }}
                >
                  <span>Izaberite stručnjaka:</span>
                  <TiArrowSortedDown className="my-mental-health-filter-choose-action-icon my-mental-health-filter-choose-action-icon-expand" />
                </button>

                <MentalHealthExpertsDropdown />
              </>
            )}
          </div>
        )}
      </div>

      {myPendingMentalHealthExpertWhoSentAnInvitationForTherapy?.length > 0 &&
        myApprovedRequests?.length < 2 && (
          <div className="my-mental-health-experts-review-pending-therapy-requests-invitations-main-container">
            <div className="my-mental-health-experts-review-pending-therapy-requests-invitations-actions">
              <button
                className="my-mental-health-experts-review-pending-therapy-requests-invitations-review-button"
                type="button"
                onClick={(e) => {
                  let myExpertsReviewPendingTherapyRequestInvitationsButton =
                    e.currentTarget
                  let myExpertsReviewUsersTherapyRequestsButton =
                    document.querySelector(
                      '.my-mental-health-experts-users-therapy-requests-review-button',
                    )

                  myExpertsReviewPendingTherapyRequestInvitationsButton.classList.add(
                    'my-mental-health-experts-review-pending-therapy-requests-invitations-review-button-hidden',
                  )

                  myExpertsReviewPendingTherapyRequestInvitationsButton.classList.remove(
                    'my-mental-health-experts-review-pending-therapy-requests-invitations-review-button-visible',
                  )

                  myExpertsReviewUsersTherapyRequestsButton.classList.add(
                    'my-mental-health-experts-users-therapy-requests-review-button-visible',
                  )

                  myExpertsReviewUsersTherapyRequestsButton.classList.remove(
                    'my-mental-health-experts-users-therapy-requests-review-button-hidden',
                  )

                  let myExpertsUsersTherapyRequestsMainContainer =
                    document.querySelector(
                      '.my-mental-health-experts-users-therapy-requests-main-container',
                    )
                  let myExpertsPendingTherapyRequestsInvitationsMainContainer =
                    document.querySelector(
                      '.my-mental-health-experts-pending-therapy-requests-invitations-main-container',
                    )
                  myExpertsUsersTherapyRequestsMainContainer.classList.add(
                    'my-mental-health-experts-users-therapy-requests-main-container-hidden',
                  )

                  myExpertsPendingTherapyRequestsInvitationsMainContainer.classList.add(
                    'my-mental-health-experts-pending-therapy-requests-invitations-main-container-on-review',
                  )
                }}
              >
                Prikaži zahtjeve
              </button>

              <button
                className="my-mental-health-experts-users-therapy-requests-review-button"
                type="button"
                onClick={(e) => {
                  let myExpertsReviewUsersTherapyRequestsButton =
                    e.currentTarget
                  let myExpertsReviewPendingTherapyRequestsInvitationsButton =
                    document.querySelector(
                      '.my-mental-health-experts-review-pending-therapy-requests-invitations-review-button',
                    )

                  myExpertsReviewUsersTherapyRequestsButton.classList.remove(
                    'my-mental-health-experts-users-therapy-requests-review-button-visible',
                  )

                  myExpertsReviewPendingTherapyRequestsInvitationsButton.classList.remove(
                    'my-mental-health-experts-review-pending-therapy-requests-invitations-review-button-hidden',
                  )

                  let myExpertsUsersTherapyRequestsMainContainer =
                    document.querySelector(
                      '.my-mental-health-experts-users-therapy-requests-main-container',
                    )
                  let myExpertsPendingTherapyRequestsInvitationsMainContainer =
                    document.querySelector(
                      '.my-mental-health-experts-pending-therapy-requests-invitations-main-container',
                    )

                  myExpertsUsersTherapyRequestsMainContainer.classList.remove(
                    'my-mental-health-experts-users-therapy-requests-main-container-hidden',
                  )

                  myExpertsPendingTherapyRequestsInvitationsMainContainer.classList.remove(
                    'my-mental-health-experts-pending-therapy-requests-invitations-main-container-on-review',
                  )
                }}
              >
                Moji stručnjaci
              </button>
            </div>
          </div>
        )}

      <div className="my-mental-health-experts-experts-container">
        <div className="my-mental-health-experts-users-therapy-requests-main-container">
          {/* {myApprovedOrPendingMentalHealthExperts?.filter(
            (mhe) =>
              mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.PENDING,
          )?.length === 0 && (
            <>
              <MyMentalHealthExpertPocket />
              <MyMentalHealthExpertPocket />
            </>
          )} */}

          {/* {myApprovedOrPendingMentalHealthExperts?.filter(
            (mhe) =>
              mhe.regularUserId === authenticatedUser?.id &&
              (mhe.requestStatus !== requestStatuses.APPROVED ||
                mhe.requestStatus !== requestStatuses.PENDING),
          )?.length === 2 && (
            <>
              <MyMentalHealthExpertPocket />
              <MyMentalHealthExpertPocket />
            </>
          )} */}

          {myApprovedOrPendingMentalHealthExperts?.length === 0 && (
            <>
              <MyMentalHealthExpertPocket />
              <MyMentalHealthExpertPocket />
            </>
          )}

          {myApprovedOrPendingMentalHealthExperts?.map((request, index) => {
            if (index >= 2) {
              return
            }
            if (request?.requestStatus === requestStatuses?.PENDING) {
              return (
                <MyMentalHealthExpertPocket request={request} key={index} />
              )
            }
            if (request?.requestStatus === requestStatuses?.APPROVED) {
              return (
                <MyMentalHealthExpertProfile expert={request} key={index} />
              )
            }
            if (
              request?.requestStatus !== requestStatuses?.APPROVED &&
              request?.requestStatus !== requestStatuses?.PENDING
            ) {
              return (
                <MyMentalHealthExpertPocket request={request} key={index} />
              )
            }
          })}

          {myApprovedOrPendingRequests?.length === 1 &&
            myApprovedOrPendingMentalHealthExperts?.length === 1 && (
              <MyMentalHealthExpertPocket />
            )}

          {/* {myApprovedOrPendingMentalHealthExperts?.filter(
            (mhe) =>
              mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.PENDING,
          )?.length === 1 && (
            <>
              <MyMentalHealthExpertProfile expert={firstElement} />
              <MyMentalHealthExpertPocket />
            </>
          )} */}

          {/* {myApprovedOrPendingMentalHealthExperts?.filter(
            (mhe) =>
              mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.APPROVED,
          )?.length === 1 && (
            <>
              <MyMentalHealthExpertProfile expert={firstElement} />
              <MyMentalHealthExpertPocket />
            </>
          )} */}

          {/* {myApprovedOrPendingMentalHealthExperts?.filter(
            (mhe) =>
              mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.APPROVED,
          )?.length === 2 && (
            <>
              <MyMentalHealthExpertProfile expert={firstElement} />
              <MyMentalHealthExpertProfile expert={secondElement} />
            </>
          )} */}
        </div>

        {myApprovedRequests?.length >= 2 || (
          <MyExpertsPendingTherapyRequestsInvitations />
        )}
      </div>
    </section>
  )
}
