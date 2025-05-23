import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { db_roles } from '../enums/roles'
import { Assignments as UserAssignments } from '../Assignments'
import { Assignments as MentalHealthExpertAssignments } from '../mental-expert-dashboard/assignments/Assignments'

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
