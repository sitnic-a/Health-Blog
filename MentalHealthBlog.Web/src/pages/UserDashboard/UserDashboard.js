import { useDispatch } from 'react-redux'
import { openTrialPeriodPopup } from '../../redux-toolkit/features/modalSlice'
import { ListOfPosts } from '../../components/ListOfPosts/ListOfPosts'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { TrialPeriodPopup } from '../../components/TrialPeriodPopup/TrialPeriodPopup'

import UserDashboardCSS from './UserDashboard.css'
import { useEffect } from 'react'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'
import { AutomaticConnectionNotifiedPopup } from '../../components/AutomaticConnectionNotifierPopup/AutomaticConnectionNotifierPopup'

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
