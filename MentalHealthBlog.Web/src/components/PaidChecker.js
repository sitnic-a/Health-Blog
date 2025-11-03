import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersTrialPeriod } from '../redux-toolkit/features/subscriptionSlice'
import { Outlet } from 'react-router-dom'

export const PaidChecker = () => {
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let { usersTrialPeriod } = useSelector((store) => store.subscription)

  let dispatch = useDispatch()
  useLayoutEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getUsersTrialPeriod(objectWithData))
  }, [])

  return usersTrialPeriod?.havePaidForSubscription ? (
    <Outlet />
  ) : (
    <p>Nije platio</p>
  )
}
