import { useDispatch, useSelector } from 'react-redux'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'
import { setTrialToExpired } from '../redux-toolkit/features/subscriptionSlice'
import { FaSlideshare } from 'react-icons/fa'
import { db_roles } from '../enums/roles'

export const SubscriptionChecker = () => {
  let dispatch = useDispatch()
  let { usersTrialPeriod } = useSelector((store) => store.subscription)

  let subscriptionTimerId
  const ONE__DAY = 86400
  const ONE__HOUR = 3600

  if (!stringIsNullOrEmpty(usersTrialPeriod)) {
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
            clearInterval(subscriptionTimerId)
            let authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
            console.log('AuthenticatedUser ', authenticatedUser)
            let isMentalHealthExpert = authenticatedUser?.userRoles?.some(
              (r) => r.id === db_roles.PSYCHOLOGIST
            )
            console.log('Is expert ', isMentalHealthExpert)

            console.log(
              'Aplikacija se zaključava! Uplatite da nastavite koristiti!'
            )
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
  console.log('Trial ', usersTrialPeriod)

  return <div></div>
}
