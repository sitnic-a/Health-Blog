import useFetchLocationState from '../components/custom/hooks/useFetchLocationState'
import { AdminDashboard } from './AdminDashboard'
import { MentalExpertDashboard } from './MentalExpertDashboard'
import { UserDashboard } from './UserDashboard'

export const Dashboard = () => {
  let { loggedUser } = useFetchLocationState()

  if (loggedUser !== null) {
    if (loggedUser.roles.some((ur) => ur.name === 'User')) {
      return <UserDashboard />
    }
    if (loggedUser.roles.some((ur) => ur.name === 'Administrator')) {
      return <AdminDashboard />
    }
    if (
      loggedUser.roles.some(
        (ur) => ur.name === 'Psychologist / Psychotherapist'
      )
    ) {
      return <MentalExpertDashboard />
    }
  }
  return <p>ERROR</p>
}
