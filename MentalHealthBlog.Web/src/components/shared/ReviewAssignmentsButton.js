import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const ReviewAssignmentsButton = () => {
  let { authenticatedUser } = useSelector((store) => store.user)
  return (
    <li id="review-assignment-container">
      <Link
        to={`/assignments/${authenticatedUser.id}`}
        className="navbar-action-shared-content"
      >
        Assignments
      </Link>
    </li>
  )
}
