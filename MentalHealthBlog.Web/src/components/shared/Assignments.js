import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { db_roles } from '../../enums/roles'
import { UserAssignments as UserAssignments } from '../UserAssignments/UserAssignments'
import { MentalHealthExpertAssignments as MentalHealthExpertAssignments } from '../mental-expert-dashboard/assignments/MentalHealthExpertAssignments'

export const Assignments = () => {
  let { id } = useParams()
  let { authenticatedUser } = useSelector((store) => store.user)
  if (authenticatedUser.userRoles.some((r) => r.id === db_roles.USER)) {
    return <UserAssignments />
  }
  if (authenticatedUser.userRoles.some((r) => r.id === db_roles.PSYCHOLOGIST)) {
    return <MentalHealthExpertAssignments />
  }
}
