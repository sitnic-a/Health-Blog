import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getUsersCurrentSubscription,
  getUsersTrialPeriod,
} from '../redux-toolkit/features/subscriptionSlice'
import { Outlet, useNavigate } from 'react-router-dom'
import { TrialPeriodExpired } from './TrialPeriodExpired/TrialPeriodExpired'

export const PaidChecker = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let isAdmin = authenticatedUser?.userRoles?.some((r) => r.id === 1)
  let { usersTrialPeriod, currentSubscription } = useSelector(
    (store) => store.subscription
  )
  let isPending = localStorage.getItem('isPending')

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }

    dispatch(getUsersTrialPeriod(objectWithData))
    dispatch(getUsersCurrentSubscription(objectWithData))
  }, [
    usersTrialPeriod?.isInTrialPeriod,
    usersTrialPeriod?.havePaidForSubscription,
  ])

  return isPending === true ||
    usersTrialPeriod?.isInTrialPeriod ||
    usersTrialPeriod?.havePaidForSubscription ||
    isAdmin ? (
    <Outlet />
  ) : (
    navigate('/expired')
  )
}
