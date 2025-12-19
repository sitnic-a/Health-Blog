import { useDispatch, useSelector } from 'react-redux'
import { getSubscriptionUsers } from '../../../../../redux-toolkit/features/subscriptionSlice'
import { suspendUser } from '../../../../../redux-toolkit/features/adminSlice'
import { openProhibitUserUsageModal } from '../../../../../redux-toolkit/features/modalSlice'
import Modal from 'react-modal'
import { application } from '../../../../../application'

import ProhibitUserUsageModalCSS from './ProhibitUserUsageModal.css'

export const ProhibitUserUsageModal = () => {
  let dispatch = useDispatch()
  let { userToProhibitUsage } = useSelector((store) => store.subscription)
  let { isProhibitUserUsageModalOpen } = useSelector((store) => store.modal)

  return (
    <Modal
      isOpen={isProhibitUserUsageModalOpen}
      style={application.modal_style}
      appElement={document.getElementById('root')}
      onRequestClose={() => {
        dispatch(openProhibitUserUsageModal(!isProhibitUserUsageModalOpen))
      }}
    >
      <div className="admin-subscriptions-prohibit-user-usage-modal">
        <div className="admin-subscriptions-prohibit-user-usage-modal-content">
          <div className="admin-subscriptions-prohibit-user-usage-modal-content-header">
            <p className="admin-subcriptions-prohibit-user-usage-header-title">
              Da li ste sigurni da želite zabraniti korištenje aplikacije?
            </p>
          </div>
          <div className="admin-subscriptions-prohibit-user-usage-modal-content-actions">
            <button
              className="admin-subscriptions-prohibit-user-usage-action admin-subscriptions-prohibit-user-usage-action-prohibit"
              type="button"
              onClick={() => {
                let authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                let authenticatedUser = JSON.parse(
                  authenticatedUserLocalStorage
                )

                let requestObj = {
                  userId: userToProhibitUsage?.userId,
                }

                let objectWithData = {
                  requestObj,
                  authenticatedUser,
                }
                dispatch(suspendUser(objectWithData)).then((data) => {
                  let statusCode = data?.payload?.statusCode
                  if (statusCode === 200) {
                    authenticatedUserLocalStorage =
                      localStorage.getItem('authenticatedUser')
                    authenticatedUser = JSON.parse(
                      authenticatedUserLocalStorage
                    )

                    let objectWithData = {
                      authenticatedUser,
                    }
                    dispatch(
                      openProhibitUserUsageModal(!isProhibitUserUsageModalOpen)
                    )
                    dispatch(getSubscriptionUsers(objectWithData))
                  }
                })
              }}
            >
              Zabrani
            </button>
            <button
              className="admin-subscriptions-prohibit-user-usage-action admin-subscriptions-prohibit-user-usage-action-cancel"
              type="button"
              onClick={() => {
                dispatch(
                  openProhibitUserUsageModal(!isProhibitUserUsageModalOpen)
                )
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
