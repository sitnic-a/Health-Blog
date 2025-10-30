import { jwtDecode } from 'jwt-decode'
import { stringIsNullOrEmpty } from '../helper-methods/methods'

let jwtIntervalId
let countdownIntervalId

export const checkIfTokenIsExpired = (token) => {
  // JWT exp is in seconds
  // -------------------------------------------------------------------------------------------
  // Possibity to decide whether user wants or not to renew its token and authentication in app
  // let authContainer = document.querySelector('#auth-container')
  // let spanContainer = document.querySelector('.auth-timer')
  // let authExpand = document.querySelector('.auth-timer-ok')
  // let authCancel = document.querySelector('.auth-timer-cancel')
  // jwtIntervalId = setInterval(() => {
  //   const ONE_MINUTE = 60000 / 1000
  //   const TIME_EXPIRED = 0
  //   let decodedToken = jwtDecode(token)
  //   let expireAtEpoch = new Date(decodedToken.exp * 1000).getTime()
  //   let expirationDate = new Date(expireAtEpoch).toLocaleString()
  //   let currentEpoch = new Date().getTime()
  //   let currentDate = new Date(currentEpoch).toLocaleString()
  //   let difference = ((expireAtEpoch - currentEpoch) / 1000).toFixed(0)
  //   console.log('Difference ', difference)
  //   // Below is the posibility to choose whether or not user want to renew jwtoken and its authentication
  //   if (difference < ONE_MINUTE) {
  //     clearInterval(jwtIntervalId)
  //     countdownIntervalId = setInterval(() => {
  //       difference -= 1
  //       console.log('Count down ', difference)
  //       spanContainer.innerHTML = difference
  //       showExpandTokenModal(authContainer)
  //       authExpand.addEventListener('click', () => {
  //         clearInterval(countdownIntervalId)
  //         console.log('Produži token')
  //         hideExpandTokenModal(authContainer)
  //         return
  //       })
  //       authCancel.addEventListener('click', () => {
  //         clearInterval(countdownIntervalId)
  //         window.location.href = '/login'
  //         hideExpandTokenModal(authContainer)
  //         return
  //       })
  //       if (difference <= TIME_EXPIRED) {
  //         clearInterval(countdownIntervalId)
  //         window.location.href = '/login'
  //         hideExpandTokenModal(authContainer)
  //         return [tokenShouldBeRenewed]
  //       }
  //     }, 1000)
  //   }
  // }, 3000)
}

export const showExpandTokenModal = (element) => {
  if (element.classList.contains('auth-container-hidden')) {
    element.classList.remove('auth-container-hidden')
    element.classList.add('auth-container-visible')
  }
}

export const hideExpandTokenModal = (element) => {
  if (element.classList.contains('auth-container-visible')) {
    element.classList.remove('auth-container-visible')
    element.classList.add('auth-container-hidden')
  }
}
