import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  changeRequestStatus,
  getMyExperts,
} from '../../../redux-toolkit/features/therapySlice'
import { getMentalHealthExperts } from '../../../redux-toolkit/features/mentalExpertSlice'
import { requestStatuses } from '../../../enums/requestStatuses'

import MyMentalHealthExpertPocketCSS from './MyMentalHealthExpertPocket.css'
import { stringIsNullOrEmpty } from '../../../utils/helper-methods/methods'

export const MyMentalHealthExpertPocket = ({ request }) => {
  let dispatch = useDispatch()

  let mentalHealthExpertFullName = String.prototype.concat(
    request?.mentalHealthExpertFirstName,
    ' ',
    request?.mentalHealthExpertLastName,
  )
  return stringIsNullOrEmpty(request) ? (
    <div className="my-mental-health-expert-pocket-main-container"></div>
  ) : (
    <>
      {request?.requestStatus !== requestStatuses.PENDING && (
        <div className="my-mental-health-expert-pocket-main-container"></div>
      )}
      {request?.requestStatus === requestStatuses.PENDING &&
        request?.mentalHealthExpertInviting === false && (
          <div className="my-mental-health-expert-pocket-main-container">
            <div className="my-mental-health-expert-pocket-content">
              <p className="my-mental-health-expert-pocket-content-description">
                Zahtjev za terapijski proces poslali ste{' '}
                <span className="my-mental-health-expert-pocket-content-description-expert-full-name">
                  {mentalHealthExpertFullName}
                </span>
              </p>
              <p className="my-mental-health-expert-pocket-content-description">
                Ukoliko želite zahtjev možete otkazati klikom na dugme ispod
              </p>
            </div>
            <div className="my-mental-health-expert-pocket-actions">
              <button
                className="my-mental-health-expert-pocket-action my-mental-health-expert-pocket-cancel-action"
                type="button"
                onClick={() => {
                  let authenticatedUserLocalStorage =
                    localStorage.getItem('authenticatedUser')
                  let authenticatedUser = JSON.parse(
                    authenticatedUserLocalStorage,
                  )

                  let requestObj = {
                    mentalHealthExpertId: request?.mentalHealthExpertId,
                    mentalHealthExpertUserId: request?.mentalHealthExpertUserId,
                    regularUserId: authenticatedUser?.id,
                    newRequestStatus: requestStatuses.UNDEFINED,
                    userSendingRequest: false,
                  }

                  let objectWithData = {
                    authenticatedUser,
                    requestObj,
                  }

                  dispatch(changeRequestStatus(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.statusCode
                    if (statusCode === 200) {
                      toast.success('Zahtjev uspješno otkazan!', {
                        autoClose: 4000,
                        position: 'bottom-right',
                      })

                      objectWithData = {
                        authenticatedUser,
                        loggedUserId: authenticatedUser?.id,
                      }
                      dispatch(getMentalHealthExperts(objectWithData))
                      dispatch(getMyExperts(objectWithData))
                    }
                  })
                }}
              >
                Otkaži zahtjev
              </button>
            </div>
          </div>
        )}

      {request?.requestStatus === requestStatuses.PENDING &&
        request?.mentalHealthExpertInviting === true && (
          <div className="my-mental-health-expert-pocket-main-container">
            <div className="my-mental-health-expert-pocket-content">
              <p className="my-mental-health-expert-pocket-content-description">
                Molimo Vas da pregledate zahtjeve koje ste dobili...
              </p>
            </div>
          </div>
        )}
    </>
  )
}
