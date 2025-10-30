import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { refreshAccessToken } from '../redux-toolkit/features/userSlice'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { Login } from './Login/Login'
import { LandingNotConfirmedMentalHealthExpert } from './LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'
import { Loader } from './shared/Loader/Loader'

export const TokenRefresher = () => {
  let dispatch = useDispatch()
  let { isLoading } = useSelector((store) => store.user)
  let isPending = localStorage.getItem('isPending')

  let refreshToken
  let authenticatedUser
  let intervalId
  let TEN_SECONDS = 10
  //   let [tokenShouldBeRefreshed, setTokenShouldBeRefreshed] = useState(false)
  let difference

  intervalId = setInterval(() => {
    if (!stringIsNullOrEmpty(localStorage.getItem('authenticatedUser'))) {
      authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'))
    } else {
      window.location.href = '/login'
    }

    let jwToken = authenticatedUser?.jwToken
    if (!stringIsNullOrEmpty(jwToken)) {
      let decodedToken = jwtDecode(jwToken)
      let expireAtEpoch = new Date(decodedToken.exp * 1000).getTime()
      let currentEpoch = new Date().getTime()
      difference = ((expireAtEpoch - currentEpoch) / 1000).toFixed(0)
      console.log('Difference ', difference)

      if (difference <= TEN_SECONDS) {
        refreshToken = Cookies.get('refreshToken')
        // console.log('Refresh token ', refreshToken)
        dispatch(refreshAccessToken(refreshToken)).then((data) => {
          localStorage.removeItem('authenticatedUser')
          localStorage.setItem(
            'authenticatedUser',
            JSON.stringify(
              data?.payload?.serviceResponseObject?.serviceResponseObject
            )
          )
          // console.log(
          //   'Token ',
          //   JSON.parse(localStorage.getItem('authenticatedUser'))?.jwToken
          // )
          clearInterval(intervalId)
        })
      }
    }
  }, 3000)

  useEffect(() => {
    return () => clearInterval(intervalId)
  }, [])

  if (!stringIsNullOrEmpty(localStorage.getItem('authenticatedUser'))) {
    return JSON.parse(localStorage.getItem('authenticatedUser')) &&
      Cookies.get('refreshToken') ? (
      <Outlet />
    ) : (
      <Login />
    )
  } else {
    window.location.href = '/login'
  }

  if (isPending) {
    return <LandingNotConfirmedMentalHealthExpert />
  }
  if (isLoading === true) {
    return <Loader />
  }
}
