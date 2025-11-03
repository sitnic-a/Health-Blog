import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersTrialPeriod } from '../redux-toolkit/features/subscriptionSlice'
import { Outlet } from 'react-router-dom'

export const PaidChecker = () => {
  let dispatch = useDispatch()

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let isAdmin = authenticatedUser?.userRoles?.some((r) => r.id === 1)
  let { usersTrialPeriod } = useSelector((store) => store.subscription)

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getUsersTrialPeriod(objectWithData))
  }, [usersTrialPeriod?.isInTrialPeriod])

  return usersTrialPeriod?.isInTrialPeriod ||
    usersTrialPeriod?.havePaidForSubscription ||
    isAdmin ? (
    <Outlet />
  ) : (
    <p>Nije platio</p>
  )
}
