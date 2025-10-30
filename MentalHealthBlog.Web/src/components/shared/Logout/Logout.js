import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../../redux-toolkit/features/userSlice'
import { resetSharedContent } from '../../../redux-toolkit/features/mentalExpertSlice'

import Cookies from 'js-cookie'
import { CiLogout } from 'react-icons/ci'

import LogoutCSS from '../Logout/Logout.css'

export const Logout = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let refreshToken = Cookies.get('refreshToken')

  return (
    <div
      className="logout-container"
      onClick={() => {
        if (authenticatedUser?.userRoles.some((role) => role.id === 4)) {
          dispatch(resetSharedContent([]))
        }

        let logoutRequest = {
          userId: authenticatedUser.id,
          refreshToken: refreshToken,
        }
        dispatch(logout(logoutRequest)).then(() => {
          Cookies.remove('refreshToken')
          localStorage.removeItem('authenticatedUser')
          localStorage.removeItem('jwToken')
          navigate('/login')
        })
      }}
    >
      <CiLogout className="logout-icon" />
      <span className="logout-title">Odjava</span>
    </div>
  )
}
