import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { getNewRegisteredExperts } from '../../../redux-toolkit/features/adminSlice'
import { toast } from 'react-toastify'

export const RequestNewExperts = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isFailed, numberOfNewlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  )

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getNewRegisteredExperts(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 404) {
          toast.error("Users couldn't be fetced properly!", {
            position: 'bottom-right',
          })
          return
        }

        if (
          data?.payload?.serviceResponseObject.length === 0 &&
          data?.payload?.statusCode === 200
        ) {
          toast.warning('There is no new requests!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }

        if (data?.payload?.statusCode === 200) {
          toast.success('Succesfully fetched requests!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
        }
      }
    })
  }, [])

  return (
    <>
      {numberOfNewlyRegisteredMentalHealthExperts > 0 && (
        <Link
          to={'/requests/new-experts'}
          className="request-link new-mental-health-expert-request-link"
        >
          {numberOfNewlyRegisteredMentalHealthExperts && (
            <span className="new-mental-health-expert-request-container-notification">
              {numberOfNewlyRegisteredMentalHealthExperts}
            </span>
          )}

          <div className="new-mental-health-expert-request-container">
            <p className="new-mental-health-expert-request-container-label">
              Mental Health Experts
            </p>
            <p className="new-mental-health-expert-request-container-info">
              Newly registered:
              {numberOfNewlyRegisteredMentalHealthExperts && (
                <span className="new-mental-health-expert-request-container-number-of-registered">
                  {numberOfNewlyRegisteredMentalHealthExperts}
                </span>
              )}
            </p>
          </div>
        </Link>
      )}

      {isFailed && (
        <div className="requests-main-container-error-container">
          <p>Wasn't able to fetch request. Something went wrong!</p>
        </div>
      )}

      {numberOfNewlyRegisteredMentalHealthExperts <= 0 &&
        isFailed === false && (
          <div>
            <p>There are no new requests!</p>
          </div>
        )}
    </>
  )
}
