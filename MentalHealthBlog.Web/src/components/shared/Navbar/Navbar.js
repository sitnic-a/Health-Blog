import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { switchActiveTab } from '../../../utils/helper-methods/methods'

import { Logout } from '../Logout/Logout'
import appLogo from '../../../images/Brain.png'

import NavbarCSS from '../Navbar/Navbar.css'
import SharedCSS from '../shared.css'

export const Navbar = () => {
  useEffect(() => {
    let tabs = document.querySelectorAll('.navigation-bar-action')
    switchActiveTab(tabs)
  }, [])

  // let { authenticatedUser } = useSelector((store) => store.user)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

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
            <Link to={'/'} className="navigation-bar-action">
              <img className="navbar-app-logo" src={appLogo} alt="App" />
            </Link>

            <Link to={'/shared-posts'} className="navigation-bar-action">
              Podijeljeno
            </Link>

            <Link to={'/my-experts'} className="navigation-bar-action">
              Stručnjaci
            </Link>

            <Link
              to={`/assignments/user/${authenticatedUser.id}`}
              className="navigation-bar-action"
            >
              Zadaće
            </Link>
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
            <Link to={'/'} className="navigation-bar-action">
              <img className="navbar-app-logo" src={appLogo} alt="App" />
            </Link>

            <Link to={`/therapy/requests`} className="navigation-bar-action">
              Zahtjevi
            </Link>

            <Link
              to={`/assignments/user/${authenticatedUser?.id}`}
              className="navigation-bar-action"
            >
              Zadaće
            </Link>

            <Link to={'/invite/user'} className="navigation-bar-action">
              Pozovi u proces
            </Link>
          </div>

          <Logout />
        </div>
      )}
    </section>
  )
}
