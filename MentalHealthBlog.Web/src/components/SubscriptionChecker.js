import { useSelector } from 'react-redux'
import { stringIsNullOrEmpty } from '../utils/helper-methods/methods'

export const SubscriptionChecker = () => {
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
            console.log(
              'Aplikacija se zaključava! Uplatite da nastavite koristiti!'
            )
            clearInterval(subscriptionTimerId)
          }
        }, ONE__HOUR)
      }

      console.log('Expires in ', timeLeftInSeconds, ' seconds')
    }, 1000)
  }
  console.log('Trial ', usersTrialPeriod)

  return <div></div>
}
