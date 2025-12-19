import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  sendExpiringEmail,
  setSubscriptionPaidStatus,
  setTrialToExpired,
} from '../redux-toolkit/features/subscriptionSlice'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { db_roles } from '../enums/roles'
import { useNavigate } from 'react-router-dom'

export const SubscriptionChecker = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { usersTrialPeriod, currentSubscription } = useSelector(
    (store) => store.subscription
  )

  let isPending = localStorage.getItem('isPending')

  let subscriptionTimerId
  const __DAY_IN_MILLISECONDS__ = 86400000
  const __THIRTY_SECONDS_IN_MILLISECONDS__ = 30000
  let timerContainer
  let timerContainerSpan

  useEffect(() => {
    if (!stringIsNullOrEmpty(usersTrialPeriod)) {
      if (isPending === false || isPending === null) {
        if (
          usersTrialPeriod?.isInTrialPeriod === false &&
          currentSubscription?.havePaidForSubscription === false
        ) {
          localStorage.removeItem('authenticatedUser')
          localStorage.removeItem('jwToken')
          Cookies.remove('refreshToken')
          navigate('/expired')
        }

        if (usersTrialPeriod?.isInTrialPeriod === true) {
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
                let authenticatedUser = JSON.parse(
                  authenticatedUserLocalStorage
                )
                let isMentalHealthExpert = authenticatedUser?.userRoles?.some(
                  (r) => r.id === db_roles.PSYCHOLOGIST
                )
                let requestObj = {
                  userId: authenticatedUser?.id,
                  isMentalHealthExpert: isMentalHealthExpert,
                }

                let objectWithData = {
                  authenticatedUser,
                  requestObj,
                }
                dispatch(sendExpiringEmail(objectWithData))
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
                  timerContainer = document.querySelector('#timer-container')

                  timerContainerSpan =
                    timerContainer.querySelector('.timer-seconds')
                  timerContainer.classList.remove('timer-container-hidden')
                  timerContainer.classList.add('timer-container-visible')

                  subscriptionTimerId = setInterval(() => {
                    let currentDate = new Date().getTime()
                    let subscriptionExpires = new Date(
                      usersTrialPeriod?.trialEndsAt
                    ).getTime()

                    let timeLeftInMilliseconds =
                      subscriptionExpires - currentDate
                    let timeLeftInSeconds = (
                      timeLeftInMilliseconds / 1000
                    ).toFixed(0)
                    console.log('Left ', timeLeftInSeconds, ' sekundi ')
                    timerContainerSpan.innerHTML = ` ${timeLeftInSeconds}`

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
                      timerContainer.classList.remove('timer-container-visible')
                      timerContainer.classList.add('timer-container-hidden')
                      dispatch(setTrialToExpired(objectWithData))
                      localStorage.removeItem('authenticatedUser')
                      localStorage.removeItem('jwToken')
                      Cookies.remove('refreshToken')
                      navigate('/expired')
                    }
                  }, 1000)
                }
              }, 3000)
            }
          }, 5000)
        } else if (currentSubscription?.havePaidForSubscription === true) {
          let currentDate = new Date().getTime()
          let subscriptionExpires = new Date(
            currentSubscription?.expiresAt
          ).getTime()

          let timeLeftInMilliseconds = subscriptionExpires - currentDate

          if (isNaN(timeLeftInMilliseconds) === true) {
            let authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
            let isMentalHealthExpert = authenticatedUser?.userRoles?.some(
              (r) => r.id === db_roles.PSYCHOLOGIST
            )

            let requestObj = {
              userId: authenticatedUser?.id,
              isMentalHealthExpert: isMentalHealthExpert,
              havePaidForSubscription: false,
              isInformedAboutSubscriptionExpiration: false,
            }
            let objectWithData = {
              authenticatedUser,
              requestObj,
            }

            dispatch(setSubscriptionPaidStatus(objectWithData)).then(() => {
              localStorage.removeItem('authenticatedUser')
              localStorage.removeItem('jwToken')
              Cookies.remove('refreshToken')
              navigate('/expired')
              return
            })
          } else {
            subscriptionTimerId = setInterval(() => {
              let currentDate = new Date().getTime()
              let subscriptionExpires = new Date(
                currentSubscription?.expiresAt
              ).getTime()

              let timeLeftInMilliseconds = subscriptionExpires - currentDate

              console.log(
                'Left ',
                (timeLeftInMilliseconds / 1000).toFixed(0),
                ' sekundi '
              )

              if (timeLeftInMilliseconds <= __DAY_IN_MILLISECONDS__) {
                clearInterval(subscriptionTimerId)
                if (
                  !currentSubscription?.isInformedAboutSubscriptionExpiration
                ) {
                  let authenticatedUserLocalStorage =
                    localStorage.getItem('authenticatedUser')
                  let authenticatedUser = JSON.parse(
                    authenticatedUserLocalStorage
                  )
                  let isMentalHealthExpert = authenticatedUser?.userRoles?.some(
                    (r) => r.id === db_roles.PSYCHOLOGIST
                  )
                  let requestObj = {
                    userId: authenticatedUser?.id,
                    isMentalHealthExpert: isMentalHealthExpert,
                  }

                  let objectWithData = {
                    authenticatedUser,
                    requestObj,
                  }
                  dispatch(sendExpiringEmail(objectWithData))
                }
                subscriptionTimerId = setInterval(() => {
                  let currentDate = new Date().getTime()
                  let subscriptionExpires = new Date(
                    currentSubscription?.expiresAt
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
                    timerContainer = document.querySelector('#timer-container')

                    timerContainerSpan =
                      timerContainer.querySelector('.timer-seconds')
                    timerContainer.classList.remove('timer-container-hidden')
                    timerContainer.classList.add('timer-container-visible')

                    subscriptionTimerId = setInterval(() => {
                      let currentDate = new Date().getTime()
                      let subscriptionExpires = new Date(
                        currentSubscription?.expiresAt
                      ).getTime()

                      let timeLeftInMilliseconds =
                        subscriptionExpires - currentDate
                      let timeLeftInSeconds = (
                        timeLeftInMilliseconds / 1000
                      ).toFixed(0)
                      console.log('Left ', timeLeftInSeconds, ' sekundi ')

                      timerContainerSpan.innerHTML = ` ${timeLeftInSeconds}`

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
                          isMentalHealthExpert: isMentalHealthExpert,
                          havePaidForSubscription: false,
                          isInformedAboutSubscriptionExpiration: false,
                        }
                        let objectWithData = {
                          authenticatedUser,
                          requestObj,
                        }
                        timerContainer.classList.remove(
                          'timer-container-visible'
                        )
                        timerContainer.classList.add('timer-container-hidden')
                        dispatch(
                          setSubscriptionPaidStatus(objectWithData)
                        ).then(() => {
                          localStorage.removeItem('authenticatedUser')
                          localStorage.removeItem('jwToken')
                          Cookies.remove('refreshToken')
                          navigate('/expired')
                        })
                      }
                    }, 1000)
                  }
                }, 3000)
              }
            }, 5000)
          }
        }
      }
    }
  }, [
    usersTrialPeriod?.isInTrialPeriod,
    currentSubscription?.havePaidForSubscription,
  ])

  return <div></div>
}
