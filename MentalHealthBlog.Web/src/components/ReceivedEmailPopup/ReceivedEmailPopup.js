import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { openEmailSuccessfullySentOpen } from '../../redux-toolkit/features/modalSlice'
import { application } from '../../application'

import { FaCheck } from 'react-icons/fa'

import ReceivedEmailPopupCSS from './ReceivedEmailPopup.css'

export const ReceivedEmailPopup = () => {
  let dispatch = useDispatch()
  let { emailSuccessfullySentOpen } = useSelector((store) => store.modal)

  return (
    <Modal
      style={application.modal_style}
      isOpen={emailSuccessfullySentOpen}
      onRequestClose={() => {
        dispatch(openEmailSuccessfullySentOpen(!emailSuccessfullySentOpen))
      }}
    >
      <section id="received-email-popup-main-container">
        <div className="received-email-popup-icons">
          <FaCheck className="received-email-popup-success-icon" />
        </div>
        <div className="received-email-popup-content-container">
          <p className="received-email-popup-content">
            Email poslan, provjerite svoju email poštu. Upute za promjenu
            passworda možete naći tamo.
          </p>
          <p className="received-email-popup-content-note">
            Ukoliko poruka nije u inboxu, provjerite svoju Neželjenu poštu ili
            Spam folder!
          </p>
        </div>
      </section>
    </Modal>
  )
}
