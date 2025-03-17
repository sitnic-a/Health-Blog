import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import {
  refreshAccessToken,
  setAuthenticatedUser,
} from './redux-toolkit/features/userSlice'
import { Login } from './Login'
import Cookies from 'js-cookie'
import { Loader } from './Loader'

export const RequireAuth = () => {
  let dispatch = useDispatch()
  let { isLoading, authenticatedUser } = useSelector((store) => store.user)
  let refreshToken = Cookies.get('refreshToken')

  useEffect(() => {
    if (authenticatedUser === null && refreshToken !== undefined) {
      dispatch(refreshAccessToken(refreshToken)).then((response) => {
        dispatch(setAuthenticatedUser(response.payload.serviceResponseObject))
      })
    }
  }, [])

  if (isLoading === true) {
    return <Loader />
  }

  return authenticatedUser?.jwToken ? <Outlet /> : <Login />
}
