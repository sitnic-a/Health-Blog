import { useDispatch, useSelector } from 'react-redux'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { setTrialToExpired } from '../redux-toolkit/features/subscriptionSlice'
import { db_roles } from '../enums/roles'
import { useEffect, useState } from 'react'

export const SubscriptionChecker = () => {
  let dispatch = useDispatch()
  let [shouldStopTheTimer, setShouldStopTheTimer] = useState(false)
  let { usersTrialPeriod } = useSelector((store) => store.subscription)

  let subscriptionTimerId
  const ONE__DAY = 86400
  const ONE__HOUR = 3600

  useEffect(() => {
    if (!stringIsNullOrEmpty(usersTrialPeriod)) {
      if (
        usersTrialPeriod?.isInTrialPeriod ||
        usersTrialPeriod?.havePaidForSubscription
      ) {
        subscriptionTimerId = setInterval(() => {
          let currentDate = new Date().getTime()
          let subscriptionExpires = new Date(
            usersTrialPeriod?.trialEndsAt
          ).getTime()

          let timeLeftInMilliseconds = subscriptionExpires - currentDate
          let timeLeftInSeconds = Math.floor(
            (timeLeftInMilliseconds / 1000).toFixed(0)
          )

          if (timeLeftInSeconds <= ONE__DAY) {
            clearInterval(subscriptionTimerId)
            subscriptionTimerId = setInterval(() => {
              let currentDate = new Date().getTime()
              let timeLeftInMilliseconds = subscriptionExpires - currentDate
              let timeLeftInSeconds = Math.floor(
                (timeLeftInMilliseconds / 1000).toFixed(0)
              )
              let timeLeftInMinutes = Math.floor(
                (timeLeftInSeconds / 60).toFixed(0)
              )
              let timeLeftInHours = Math.floor(
                (timeLeftInMinutes / ONE__HOUR).toFixed(0)
              )

              let timeLeftInDays = Math.floor((timeLeftInHours / 24).toFixed(0))
              console.log('Ostalo ', timeLeftInMinutes, ' minuta ')

              if (timeLeftInMilliseconds <= 0) {
                let authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                let authenticatedUser = JSON.parse(
                  authenticatedUserLocalStorage
                )
                let isMentalHealthExpert = authenticatedUser?.userRoles?.some(
                  (r) => r.id === db_roles.PSYCHOLOGIST
                )

                console.log(
                  'Aplikacija se zaključava! Uplatite da nastavite koristiti!'
                )
                clearInterval(subscriptionTimerId)

                let requestObj = {
                  userId: authenticatedUser?.id,
                  isInTrialPeriod: false,
                  isMentalHealthExpert: isMentalHealthExpert,
                }
                let objectWithData = {
                  authenticatedUser,
                  requestObj,
                }
                dispatch(setTrialToExpired(objectWithData))
              }
            }, ONE__HOUR)
          }

          console.log('Expires in ', timeLeftInSeconds, ' seconds')
        }, 1000)
      }
    }
  }, [usersTrialPeriod?.isInTrialPeriod])

  return <div></div>
}
