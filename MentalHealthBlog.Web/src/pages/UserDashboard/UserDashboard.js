import { useDispatch } from 'react-redux'
import { openTrialPeriodPopup } from '../../redux-toolkit/features/modalSlice'
import { ListOfPosts } from '../../components/ListOfPosts/ListOfPosts'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { TrialPeriodPopup } from '../../components/TrialPeriodPopup/TrialPeriodPopup'

import UserDashboardCSS from './UserDashboard.css'
import { useEffect } from 'react'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'

export const UserDashboard = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  dispatch(openTrialPeriodPopup(authenticatedUser?.isUsingForTheFirstTime))

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getUsersTrialPeriod(objectWithData))
  }, [])

  return (
    <section className="user-dashboard">
      <TrialPeriodPopup authenticatedUser={authenticatedUser} />

      <Navbar />
      <ListOfPosts />
    </section>
  )
}
