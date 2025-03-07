import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  refreshAccessToken,
  setAuthenticatedUser,
} from './redux-toolkit/features/userSlice'
import { Outlet } from 'react-router-dom'
import { Login } from './Login'

export const RequireAuth = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let refreshToken = Cookies.get('refreshToken')

  useEffect(() => {
    if (authenticatedUser === null && refreshToken !== undefined) {
      dispatch(refreshAccessToken(refreshToken)).then((response) => {
        dispatch(setAuthenticatedUser(response.payload.serviceResponseObject))
      })
    }
  }, [])

  return authenticatedUser?.jwToken ? <Outlet /> : <Login />
}
