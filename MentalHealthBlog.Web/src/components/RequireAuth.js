import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import {
  refreshAccessToken,
  setAuthenticatedUser,
} from '../redux-toolkit/features/userSlice'
import { Login } from './Login/Login'
import Cookies from 'js-cookie'
import { Loader } from './shared/Loader/Loader'
import { LandingNotConfirmedMentalHealthExpert } from './LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'

export const RequireAuth = () => {
  let dispatch = useDispatch()

  let { isLoading, authenticatedUser } = useSelector((store) => store.user)
  let isPending = localStorage.getItem('isPending')
  let refreshToken = Cookies.get('refreshToken')

  useEffect(() => {
    if (authenticatedUser === null && refreshToken !== undefined) {
      dispatch(refreshAccessToken(refreshToken)).then((response) => {
        dispatch(setAuthenticatedUser(response.payload?.serviceResponseObject))
      })
    }
  }, [])

  if (isPending) {
    return <LandingNotConfirmedMentalHealthExpert />
  }
  if (isLoading === true) {
    return <Loader />
  }

  return authenticatedUser?.jwToken && refreshToken ? <Outlet /> : <Login />
}
