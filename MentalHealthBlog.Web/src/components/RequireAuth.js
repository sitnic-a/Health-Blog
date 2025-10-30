import { useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import { Login } from './Login/Login'
import Cookies from 'js-cookie'
import { Loader } from './shared/Loader/Loader'
import { LandingNotConfirmedMentalHealthExpert } from './LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'

export const RequireAuth = () => {
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let refreshToken = Cookies.get('refreshToken')

  return authenticatedUser?.jwToken && refreshToken ? <Outlet /> : <Login />
}
