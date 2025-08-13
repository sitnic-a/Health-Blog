import { jwtDecode } from 'jwt-decode'

export const verifyToken = (token) => {
  const ONE_MINUTE = 60000
  let decodedToken = jwtDecode(token)
  // console.log("Decoded token ", decodedToken);

  let expireAtEpoch = new Date(decodedToken.exp * 1000).getTime()
  let expirationDate = new Date(expireAtEpoch).toLocaleString()
  console.log('Expire at ', expireAtEpoch, expirationDate)

  let currentEpoch = new Date().getTime()
  let currentDate = new Date(currentEpoch).toLocaleString()
  console.log('Current ', currentEpoch, currentDate)

  let difference = expireAtEpoch - currentEpoch
  console.log('Difference ', difference)

  if (difference < ONE_MINUTE) {
    return false
  }
  return true

  // JWT exp is in seconds
}
