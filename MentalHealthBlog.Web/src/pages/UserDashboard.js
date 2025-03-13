import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../components/redux-toolkit/features/userSlice'
import { ListOfPosts } from '../components/ListOfPosts'
import Cookies from 'js-cookie'
import { CiLogout } from 'react-icons/ci'

export const UserDashboard = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { authenticatedUser } = useSelector((store) => store.user)
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
                      userId: authenticatedUser.id,
                      refreshToken: refreshToken,
                    }
                    dispatch(logout(logoutRequest)).then(() => {
                      Cookies.remove('refreshToken')
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
