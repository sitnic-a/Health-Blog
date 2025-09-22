import { jwtDecode } from 'jwt-decode'

export const verifyToken = (token) => {
  const ONE_MINUTE = 60000
  let decodedToken = jwtDecode(token)

  let expireAtEpoch = new Date(decodedToken.exp * 1000).getTime()
  let expirationDate = new Date(expireAtEpoch).toLocaleString()

  let currentEpoch = new Date().getTime()
  let currentDate = new Date(currentEpoch).toLocaleString()

  let difference = expireAtEpoch - currentEpoch

  if (difference < ONE_MINUTE) {
    return false
  }
  return true

  // JWT exp is in seconds
}
