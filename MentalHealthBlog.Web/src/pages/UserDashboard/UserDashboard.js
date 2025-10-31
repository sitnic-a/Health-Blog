import { useDispatch } from 'react-redux'
import { ListOfPosts } from '../../components/ListOfPosts/ListOfPosts'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { TrialPeriodPopup } from '../../components/TrialPeriodPopup'

import UserDashboardCSS from './UserDashboard.css'
import { openTrialPeriodPopup } from '../../redux-toolkit/features/modalSlice'

export const UserDashboard = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  dispatch(openTrialPeriodPopup(authenticatedUser?.isUsingForTheFirstTime))

  return (
    <section className="user-dashboard">
      <TrialPeriodPopup authenticatedUser={authenticatedUser} />

      <Navbar />
      <ListOfPosts />
    </section>
  )
}
