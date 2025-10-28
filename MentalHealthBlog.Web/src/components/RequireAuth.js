import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import {
  refreshAccessToken,
  setAuthenticatedUser,
} from '../redux-toolkit/features/userSlice'
import { Login } from './Login/Login'
import Cookies from 'js-cookie'
import { Loader } from './shared/Loader/Loader'
import { LandingNotConfirmedMentalHealthExpert } from './LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { checkIfTokenIsExpired } from '../utils/helper-methods/jwt'

export const RequireAuth = () => {
  let dispatch = useDispatch()
  let location = useLocation()

  let { isLoading } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let isPending = localStorage.getItem('isPending')
  let tokenShouldBeRenewed = localStorage.getItem('tokenShouldBeRenewed')
  let refreshToken = Cookies.get('refreshToken')

  useEffect(() => {
    console.log('AUTH ', authenticatedUser)

    if (!stringIsNullOrEmpty(authenticatedUser?.jwToken)) {
      checkIfTokenIsExpired(authenticatedUser?.jwToken)
    }

    if (tokenShouldBeRenewed) {
      dispatch(refreshAccessToken(refreshToken)).then((response) => {
        dispatch(
          setAuthenticatedUser(
            response.payload?.serviceResponseObject?.serviceResponseObject
          )
        )
        localStorage.setItem(
          'authenticatedUser',
          JSON.stringify(
            response?.payload?.serviceResponseObject?.serviceResponseObject
          )
        )
        localStorage.removeItem('tokenShouldBeRenewed')
      })
    }
  }, [authenticatedUser?.jwToken])

  if (isPending) {
    return <LandingNotConfirmedMentalHealthExpert />
  }
  if (isLoading === true) {
    return <Loader />
  }

  return authenticatedUser?.jwToken && refreshToken ? <Outlet /> : <Login />
}
