import { useSelector } from 'react-redux'
import { AdminDashboard } from './AdminDashboard/AdminDashboard'
import { MentalExpertDashboard } from './MentalExpertDashboard/MentalExpertDashboard'
import { UserDashboard } from './UserDashboard/UserDashboard'

import Cookies from 'js-cookie'
import { LandingNotConfirmedMentalHealthExpert } from '../components/LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'

export const Dashboard = () => {
  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  var isPending = localStorage.getItem('isPending')

  if (isPending == false || isPending == null || isPending == undefined) {
    if (authenticatedUser?.userRoles?.some((ur) => ur.name === 'User')) {
      return <UserDashboard />
    }
    if (
      authenticatedUser?.userRoles?.some((ur) => ur.name === 'Administrator')
    ) {
      return <AdminDashboard />
    }
    if (
      authenticatedUser?.userRoles?.some(
        (ur) => ur.name === 'Psychologist / Psychotherapist'
      )
    ) {
      return <MentalExpertDashboard />
    }
    return <p>ERROR</p>
  } else {
    return <LandingNotConfirmedMentalHealthExpert />
  }
}
