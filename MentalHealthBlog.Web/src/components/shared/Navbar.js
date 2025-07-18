import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Logout } from './Logout'
import { ReviewAssignmentsButton } from './ReviewAssignmentsButton'

export const Navbar = () => {
  let { authenticatedUser } = useSelector((store) => store.user)
  console.log('Authenticated user ', authenticatedUser)

  let __ADMIN_ROLE_ID = 1
  let __USER_ROLE_ID = 2
  let __PSYCHOLOGIST_ROLE_ID = 4

  return (
    <section id="navigation-bar-main-container">
      {authenticatedUser?.userRoles?.some(
        (role) => role?.id === __ADMIN_ROLE_ID
      ) && (
        <div className="navigation-bar-container">
          <div className="navigation-bar-features"></div>

          <div className="signout-container">
            <Logout />
          </div>
        </div>
      )}

      {authenticatedUser?.userRoles?.some(
        (role) => role?.id === __USER_ROLE_ID
      ) && (
        <div className="navigation-bar-container">
          <div className="navigation-bar-features">
            <Link to={'/shared-posts'} className="navigation-bar-action">
              Shared Content
            </Link>
            <Link
              to={`/assignments/user/${authenticatedUser.id}`}
              className="navigation-bar-action"
            >
              Assignments
            </Link>
          </div>

          <div className="signout-container">
            <Logout />
          </div>
        </div>
      )}

      {authenticatedUser?.userRoles?.some(
        (role) => role?.id === __PSYCHOLOGIST_ROLE_ID
      ) && (
        <div className="navigation-bar-container">
          <div className="navigation-bar-features">
            <Link
              to={`/assignments/user/${authenticatedUser?.id}`}
              className="navigation-bar-action"
            >
              Assignments
            </Link>
          </div>

          <Logout />
        </div>
      )}
    </section>
  )
}
