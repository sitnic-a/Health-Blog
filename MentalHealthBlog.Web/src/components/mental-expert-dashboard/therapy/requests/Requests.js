import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRequestsForMentalHealthExpert } from '../../../../redux-toolkit/features/therapySlice'
import { Navbar } from '../../../shared/Navbar/Navbar'

import RequestsCSS from './Requests.css'
import { formatDateToString } from '../../../../utils/helper-methods/methods'

export const Requests = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { requestsForMentalHealthExpert, isLoading } = useSelector(
    (store) => store.therapy
  )

  console.log('Authenticated user ', authenticatedUser)

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getRequestsForMentalHealthExpert(objectWithData))
  }, [])

  return (
    <section id="therapy-requests-main-container">
      <Navbar />

      <div className="therapy-requests-container">
        {requestsForMentalHealthExpert?.length > 0 && (
          <div className="therapy-requests-requests-container">
            <div className="therapy-requests-requests-content">
              {requestsForMentalHealthExpert?.map((request) => {
                let sentAt = formatDateToString(request?.sentAt)
                return (
                  <div className="therapy-requests-requests-content-row">
                    <span className="therapy-requests-requests-content-cell">
                      {request?.regularUserLastName}
                      {request?.regularUserFirstName}
                    </span>
                    <span className="therapy-requests-requests-content-cell">
                      {sentAt}
                    </span>
                    <span className="therapy-requests-requests-content-cell">
                      <button type="button">Approve</button>
                      <button type="button">Decline</button>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {requestsForMentalHealthExpert?.length <= 0 && (
        <div className="therapy-requests-main-error-container">
          <p className="therapy-requests-main-error-description">
            There are no new requests for you!
          </p>
        </div>
      )}
    </section>
  )
}
