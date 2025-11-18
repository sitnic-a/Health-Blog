import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  sendTrialExpiringnEmail,
  setSubscriptionPaidStatus,
  setTrialToExpired,
} from '../redux-toolkit/features/subscriptionSlice'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { db_roles } from '../enums/roles'

export const SubscriptionChecker = () => {
  let dispatch = useDispatch()
  let { usersTrialPeriod, currentSubscription } = useSelector(
    (store) => store.subscription
  )

  let subscriptionTimerId
  const __DAY_IN_MILLISECONDS__ = 86400000
  const __THIRTY_SECONDS_IN_MILLISECONDS__ = 30000

  useEffect(() => {
    if (!stringIsNullOrEmpty(usersTrialPeriod)) {
      if (usersTrialPeriod?.isInTrialPeriod) {
        subscriptionTimerId = setInterval(() => {
          let currentDate = new Date().getTime()
          let subscriptionExpires = new Date(
            usersTrialPeriod?.trialEndsAt
          ).getTime()

          let timeLeftInMilliseconds = subscriptionExpires - currentDate
          console.log(
            'Left ',
            (timeLeftInMilliseconds / 1000).toFixed(0),
            ' sekundi '
          )

          if (timeLeftInMilliseconds <= __DAY_IN_MILLISECONDS__) {
            clearInterval(subscriptionTimerId)
            if (!usersTrialPeriod?.isInformedAboutSubscriptionExpiration) {
              let authenticatedUserLocalStorage =
                localStorage.getItem('authenticatedUser')
              let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
              let requestObj = {
                userId: authenticatedUser?.id,
                userRoles: authenticatedUser?.userRoles,
              }

              let objectWithData = {
                authenticatedUser,
                requestObj,
              }
              dispatch(sendTrialExpiringnEmail(objectWithData))
            }
            subscriptionTimerId = setInterval(() => {
              let currentDate = new Date().getTime()
              let subscriptionExpires = new Date(
                usersTrialPeriod?.trialEndsAt
              ).getTime()

              let timeLeftInMilliseconds = subscriptionExpires - currentDate
              console.log(
                'Left ',
                (timeLeftInMilliseconds / 1000).toFixed(0),
                ' sekundi '
              )

              if (
                timeLeftInMilliseconds <= __THIRTY_SECONDS_IN_MILLISECONDS__
              ) {
                clearInterval(subscriptionTimerId)
                subscriptionTimerId = setInterval(() => {
                  let currentDate = new Date().getTime()
                  let subscriptionExpires = new Date(
                    usersTrialPeriod?.trialEndsAt
                  ).getTime()

                  let timeLeftInMilliseconds = subscriptionExpires - currentDate
                  console.log(
                    'Left ',
                    (timeLeftInMilliseconds / 1000).toFixed(0),
                    ' sekundi '
                  )
                  if (timeLeftInMilliseconds <= 1000) {
                    let authenticatedUserLocalStorage =
                      localStorage.getItem('authenticatedUser')
                    let authenticatedUser = JSON.parse(
                      authenticatedUserLocalStorage
                    )
                    let isMentalHealthExpert =
                      authenticatedUser?.userRoles?.some(
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
                    localStorage.removeItem('authenticatedUser')
                    localStorage.removeItem('jwToken')
                    Cookies.remove('refreshToken')
                  }
                }, 1000)
              }
            }, 3000)
          }
        }, 5000)
      } else if (currentSubscription?.havePaidForSubscription === true) {
        console.log('We in')
        subscriptionTimerId = setInterval(() => {
          let currentDate = new Date().getTime()
          let expiresAt = new Date(currentSubscription?.expiresAt).getTime()
          let timeLeftInMilliseconds = expiresAt - currentDate
          console.log(
            'Left ',
            (timeLeftInMilliseconds / 1000).toFixed(0),
            ' sekundi '
          )
          if (timeLeftInMilliseconds <= 1) {
            clearInterval(subscriptionTimerId)
            console.log('Zakljucaj aplikaciju')
            let authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
            let requestObj = {
              userId: authenticatedUser?.id,
              havePaidForSubscription: false,
            }
            let objectWithData = {
              authenticatedUser,
              requestObj,
            }
            dispatch(setSubscriptionPaidStatus(objectWithData))
            return
          }
        }, 1000)
      }
    }
  }, [
    usersTrialPeriod?.isInTrialPeriod,
    currentSubscription?.havePaidForSubscription,
  ])

  return <div></div>
}
