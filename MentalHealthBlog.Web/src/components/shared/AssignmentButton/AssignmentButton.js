import { useLocation, useNavigate } from 'react-router-dom'
import { FaTasks } from 'react-icons/fa'
import Cookies from 'js-cookie'

import AssignmentButtonCSS from './AssignmentButton.css'

export const AssignmentButton = () => {
  let location = useLocation()
  let navigate = useNavigate()

  return (
    <div
      className="sharing-users-give-assignment-container"
      onClick={() => {
        console.log('Location ', location)
        if (location?.pathname !== '/') {
          const now = new Date()
          const time = now.getTime()
          const expireTime = time + 1000 * 60 * 15
          now.setTime(expireTime)

          Cookies.set('mentalHealthExpertIsChoosingUser', true, {
            expires: now,
          })
          navigate('/create-assignment')
          return
        }
        Cookies.remove('mentalHealthExpertIsChoosingUser')
        navigate('/create-assignment')
      }}
    >
      <span className="sharing-users-give-assignment-span">Kreiraj zadaću</span>
      <FaTasks className="sharing-users-give-assignment-icon" />
    </div>
  )
}
