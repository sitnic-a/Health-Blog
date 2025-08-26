import { useDispatch, useSelector } from 'react-redux'
import { Navbar } from '../../shared/Navbar/Navbar'
import { MyMentalHealthExpertPocket } from '../MyMentalHealthExpertPocket/MyMentalHealthExpertPocket'
import { MentalHealthExpertsDropdown } from '../../MentalHealthExpertsDropdown/MentalHealthExpertsDropdown'

import { TiArrowSortedDown } from 'react-icons/ti'

import MyMentalHealthExpertsCSS from './MyMentalHealthExperts.css'
import { useEffect } from 'react'
import { getMyExperts } from '../../../redux-toolkit/features/therapySlice'
import { MyMentalHealthExpertProfile } from '../MyMentalHealthExpertProfile/MyMentalHealthExpertProfile'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'
import { requestStatuses } from '../../../enums/requestStatuses'
import { setActiveMyMentalHealthExpertFilterActionTab } from '../../../utils/helper-methods/methods'

export const MyMentalHealthExperts = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { myApprovedOrPendingMentalHealthExperts } = useSelector(
    (store) => store.therapy
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
        <button
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
        </button>

        {myApprovedOrPendingMentalHealthExperts?.filter(
          (mhe) =>
            (mhe.regularUserId === authenticatedUser?.id &&
              mhe.requestStatus === requestStatuses.APPROVED) ||
            mhe.requestStatus === requestStatuses.PENDING
        )?.length >= 2 || (
          <div className="my-mental-health-filter-choose-action-main-container">
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
              <span>Choose an expert:</span>
              <TiArrowSortedDown className="my-mental-health-filter-choose-action-icon my-mental-health-filter-choose-action-icon-expand" />
            </button>

            <MentalHealthExpertsDropdown />
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
