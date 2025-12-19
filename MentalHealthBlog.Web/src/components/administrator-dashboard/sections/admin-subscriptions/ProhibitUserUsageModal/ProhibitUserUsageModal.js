import Modal from 'react-modal'
import { application } from '../../../../../application'

import ProhibitUserUsageModalCSS from './ProhibitUserUsageModal.css'
import { useDispatch, useSelector } from 'react-redux'
import { openProhibitUserUsageModal } from '../../../../../redux-toolkit/features/modalSlice'

export const ProhibitUserUsageModal = () => {
  let dispatch = useDispatch()
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
