import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'
import { getMyExperts } from '../../../redux-toolkit/features/therapySlice'
import { setActiveMyMentalHealthExpertFilterActionTab } from '../../../utils/helper-methods/methods'
import { MyMentalHealthExpertPocket } from '../MyMentalHealthExpertPocket/MyMentalHealthExpertPocket'
import { MentalHealthExpertsDropdown } from '../../MentalHealthExpertsDropdown/MentalHealthExpertsDropdown'
import { MyMentalHealthExpertProfile } from '../MyMentalHealthExpertProfile/MyMentalHealthExpertProfile'
import { Navbar } from '../../shared/Navbar/Navbar'
import { requestStatuses } from '../../../enums/requestStatuses'
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner'

import { TiArrowSortedDown } from 'react-icons/ti'

import MyMentalHealthExpertsCSS from './MyMentalHealthExperts.css'

export const MyMentalHealthExperts = () => {
  let dispatch = useDispatch()
  let { isLoadingExperts } = useSelector((store) => store.mentalExpert)
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let { myApprovedOrPendingMentalHealthExperts } = useSelector(
    (store) => store.therapy
  )

  let myApprovedOrPendingRequests =
    myApprovedOrPendingMentalHealthExperts.filter(
      (tr) =>
        tr.requestStatus === requestStatuses.APPROVED ||
        tr.requestStatus === requestStatuses.PENDING
    )

  let firstElement = myApprovedOrPendingMentalHealthExperts?.filter(
    (mhe) =>
      mhe.regularUserId === authenticatedUser?.id &&
      mhe.requestStatus === requestStatuses.APPROVED
  )[0]

  let secondElement = myApprovedOrPendingMentalHealthExperts?.filter(
    (mhe) =>
      mhe.regularUserId === authenticatedUser?.id &&
      mhe.requestStatus === requestStatuses.APPROVED
  )[1]

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
      loggedUserId: authenticatedUser?.id,
    }
    dispatch(getMyExperts(objectWithData))
    dispatch(getMentalHealthExperts(objectWithData))
  }, [])

  let usersMentalHealthExperts = myApprovedOrPendingMentalHealthExperts?.filter(
    (mhe) =>
      (mhe.regularUserId === authenticatedUser?.id &&
        mhe.requestStatus === requestStatuses.APPROVED) ||
      mhe.requestStatus === requestStatuses.PENDING
  )

  let usersCurrentMentalHealthExperts =
    myApprovedOrPendingMentalHealthExperts?.filter(
      (mhe) =>
        mhe.regularUserId === authenticatedUser?.id &&
        mhe.requestStatus === requestStatuses.APPROVED
    )

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
              myApprovedOrPendingRequests.length >= 2 &&
              mhe.requestStatus === requestStatuses.APPROVED) ||
            mhe.requestStatus === requestStatuses.PENDING
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
                      'main-mental-health-expert-picker'
                    )

                    let expandIcon = document.querySelector(
                      '.my-mental-health-filter-choose-action-icon'
                    )

                    if (
                      mainMentalHealthExpertPicker.classList.contains(
                        'main-mental-health-expert-picker-shrinked'
                      )
                    ) {
                      mainMentalHealthExpertPicker.classList.remove(
                        'main-mental-health-expert-picker-shrinked'
                      )
                      mainMentalHealthExpertPicker.classList.add(
                        'main-mental-health-expert-picker-expanded'
                      )

                      expandIcon.classList.remove(
                        'my-mental-health-filter-choose-action-icon-expand'
                      )
                      expandIcon.classList.add(
                        'my-mental-health-filter-choose-action-icon-shrink'
                      )
                      return
                    }

                    if (
                      mainMentalHealthExpertPicker.classList.contains(
                        'main-mental-health-expert-picker-expanded'
                      )
                    ) {
                      mainMentalHealthExpertPicker.classList.remove(
                        'main-mental-health-expert-picker-expanded'
                      )
                      mainMentalHealthExpertPicker.classList.add(
                        'main-mental-health-expert-picker-shrinked'
                      )

                      expandIcon.classList.remove(
                        'my-mental-health-filter-choose-action-icon-shrink'
                      )
                      expandIcon.classList.add(
                        'my-mental-health-filter-choose-action-icon-expand'
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

      <div className="my-mental-health-experts-experts-container">
        {myApprovedOrPendingMentalHealthExperts?.filter(
          (mhe) =>
            (mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.APPROVED) ||
            mhe.requestStatus === requestStatuses.PENDING
        )?.length === 0 && (
          <>
            <MyMentalHealthExpertPocket />
            <MyMentalHealthExpertPocket />
          </>
        )}

        {myApprovedOrPendingMentalHealthExperts?.filter(
          (mhe) =>
            mhe.regularUserId === authenticatedUser?.id &&
            mhe.requestStatus === requestStatuses.APPROVED
        )?.length === 1 && (
          <>
            <MyMentalHealthExpertProfile expert={firstElement} />
            <MyMentalHealthExpertPocket />
          </>
        )}

        {myApprovedOrPendingMentalHealthExperts?.filter(
          (mhe) =>
            mhe.regularUserId === authenticatedUser?.id &&
            mhe.requestStatus === requestStatuses.APPROVED
        )?.length === 2 && (
          <>
            <MyMentalHealthExpertProfile expert={firstElement} />
            <MyMentalHealthExpertProfile expert={secondElement} />
          </>
        )}
      </div>
    </section>
  )
}
