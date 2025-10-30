import Modal from 'react-modal'
import { application } from '../../application'
import { useDispatch, useSelector } from 'react-redux'
import { openStopSharing } from '../../redux-toolkit/features/modalSlice'
import {
  changeRequestStatus,
  setExperts,
  stopSharing,
} from '../../redux-toolkit/features/therapySlice'
import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'

import StopSharingConfirmationCSS from './StopSharingConfirmation.css'

export const StopSharingConfirmation = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { stopSharingObject } = useSelector((store) => store.therapy)
  let { isStopSharingOpen } = useSelector((store) => store.modal)

  return (
    <Modal
      isOpen={isStopSharingOpen}
      appElement={document.getElementById('root')}
      style={application.modal_style}
      onRequestClose={() => {
        dispatch(openStopSharing(!isStopSharingOpen))
      }}
    >
      <div className="stop-sharing-modal-main-container">
        <div className="stop-sharing-modal-header">
          <p className="stop-sharing-modal-header-title">
            Da li sačuvati historiju sadržaja na svom profilu?
            {/* Would you also like to remove shared content from your page? */}
          </p>
        </div>

        <div className="stop-sharing-modal-content">
          <div className="stop-sharing-modal-content-actions">
            <button
              type="button"
              className="stop-sharing-modal-content-action stop-sharing-modal-action-remove"
              onClick={() => {
                authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
                dispatch(changeRequestStatus(stopSharingObject)).then(
                  (data) => {
                    let statusCode = data?.payload?.statusCode
                    if (statusCode === 200) {
                      let myMentalHealthExperts = data?.payload
                      dispatch(setExperts(myMentalHealthExperts))
                      let objectWithData = {
                        authenticatedUser,
                      }
                      dispatch(getMentalHealthExperts(objectWithData))
                    }
                  }
                )
                let request = {
                  authenticatedUser,
                  mentalHealthExpertId: stopSharingObject?.mentalHealthExpertId,
                  regularUserId: stopSharingObject?.regularUserId,
                  isKeepingContent: false,
                }
                dispatch(stopSharing(request))
                dispatch(openStopSharing(!isStopSharingOpen))
              }}
            >
              Obriši
            </button>
            <button
              type="button"
              className="stop-sharing-modal-content-action stop-sharing-modal-action-keep-content"
              onClick={() => {
                authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
                dispatch(changeRequestStatus(stopSharingObject)).then(
                  (data) => {
                    let statusCode = data?.payload?.statusCode
                    if (statusCode === 200) {
                      let myMentalHealthExperts = data?.payload
                      dispatch(setExperts(myMentalHealthExperts))
                      let objectWithData = {
                        authenticatedUser,
                      }
                      dispatch(getMentalHealthExperts(objectWithData))
                    }
                  }
                )
                let request = {
                  authenticatedUser,
                  mentalHealthExpertId: stopSharingObject?.mentalHealthExpertId,
                  regularUserId: stopSharingObject?.regularUserId,
                  isKeepingContent: true,
                }
                dispatch(stopSharing(request))
                dispatch(openStopSharing(!isStopSharingOpen))
              }}
            >
              Sačuvaj sadržaj
            </button>
            <button
              type="button"
              className="stop-sharing-modal-content-action stop-sharing-modal-action-cancel"
              onClick={() => {
                dispatch(openStopSharing(!isStopSharingOpen))
              }}
            >
              Odustani
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
