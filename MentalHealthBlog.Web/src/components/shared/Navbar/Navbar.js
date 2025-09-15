import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Logout } from '../Logout/Logout'

import NavbarCSS from '../Navbar/Navbar.css'

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

          <div className="logout-main-container">
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

            <Link to={'/my-experts'} className="navigation-bar-action">
              My Mental Health Experts
            </Link>

            {/* <Link
              to={`/assignments/user/${authenticatedUser.id}`}
              className="navigation-bar-action"
            >
              Assignments
            </Link> */}
          </div>

          <div className="logout-main-container">
            <Logout />
          </div>
        </div>
      )}

      {authenticatedUser?.userRoles?.some(
        (role) => role?.id === __PSYCHOLOGIST_ROLE_ID
      ) && (
        <div className="navigation-bar-container">
          <div className="navigation-bar-features">
            <Link to={`/therapy/requests`} className="navigation-bar-action">
              Requests
            </Link>

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
