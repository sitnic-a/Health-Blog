import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'
import {
  getMentalHealthExpertsWhoSentUserAnInvitationForTherapy,
  getMyExperts,
} from '../../redux-toolkit/features/therapySlice'
import { ListOfPosts } from '../../components/ListOfPosts/ListOfPosts'
import { requestStatuses } from '../../enums/requestStatuses'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { TrialPeriodPopup } from '../../components/TrialPeriodPopup/TrialPeriodPopup'
import { AutomaticConnectionNotifiedPopup } from '../../components/AutomaticConnectionNotifierPopup/AutomaticConnectionNotifierPopup'

import UserDashboardCSS from './UserDashboard.css'

export const UserDashboard = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  useEffect(() => {
    if (!authenticatedUser?.isUsingForTheFirstTime) {
      let objectWithData = {
        authenticatedUser,
      }
      dispatch(getUsersTrialPeriod(objectWithData))
      console.log('Counting....')
    }

    let objectWithData = {
      authenticatedUser,
      loggedUserId: authenticatedUser?.id,
    }
    dispatch(getMyExperts(objectWithData))

    let query = {
      loggedUserId: authenticatedUser?.id,
      requestStatus: requestStatuses.PENDING,
      IsMentalHealthExpertInviting: true,
    }

    objectWithData = {
      authenticatedUser,
      query,
    }
    dispatch(
      getMentalHealthExpertsWhoSentUserAnInvitationForTherapy(objectWithData),
    )
  }, [])

  return (
    <section className="user-dashboard">
      <TrialPeriodPopup />
      <AutomaticConnectionNotifiedPopup />

      <Navbar />
      <ListOfPosts />
    </section>
  )
}
