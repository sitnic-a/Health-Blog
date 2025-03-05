import { Link, useNavigate } from 'react-router-dom'
import { ListOfPosts } from '../components/ListOfPosts'
import useFetchLocationState from '../components/custom/hooks/useFetchLocationState'
import { CiLogout } from 'react-icons/ci'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { logout } from '../components/redux-toolkit/features/userSlice'

export const UserDashboard = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { loggedUser } = useFetchLocationState()
  let refreshToken = Cookies.get('refreshToken')
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul className="navbar-list">
            <li>
              <Link
                to={'shared-posts'}
                state={{
                  loggedUser,
                }}
                className="navbar-action-shared-content"
              >
                Shared Content
              </Link>
            </li>
            <div className="logout-container">
              <li className="logout-icon-container">
                <CiLogout
                  className="logout-icon"
                  onClick={() => {
                    let logoutRequest = {
                      userId: loggedUser.id,
                      refreshToken: refreshToken,
                    }
                    dispatch(logout(logoutRequest)).then((data) => {
                      navigate('login')
                    })
                  }}
                />
              </li>
            </div>
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  )
}
