import { useSelector } from 'react-redux'
import { AdminDashboard } from './AdminDashboard'
import { MentalExpertDashboard } from './MentalExpertDashboard'
import { UserDashboard } from './UserDashboard'

export const Dashboard = () => {
  let { authenticatedUser } = useSelector((store) => store.user)

  if (authenticatedUser?.userRoles?.some((ur) => ur.name === 'User')) {
    return <UserDashboard />
  }
  if (authenticatedUser?.userRoles?.some((ur) => ur.name === 'Administrator')) {
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
}
