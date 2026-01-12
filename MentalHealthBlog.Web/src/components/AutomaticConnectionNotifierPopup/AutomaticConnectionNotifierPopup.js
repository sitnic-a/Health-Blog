import Modal from 'react-modal'
import { CiCircleInfo } from 'react-icons/ci'
import { application } from '../../application'

import AutomaticConnectionNotifierPopupCSS from './AutomaticConnectionNotifierPopup.css'

export const AutomaticConnectionNotifiedPopup = () => {
  return (
    <section id="automatic-connection-notifier-main-container">
      <Modal
        isOpen={true}
        appElement={document.getElementById('root')}
        style={application.trial_period_style}
      >
        <div className="automatic-connection-notifier-modal">
          <div className="automatic-connection-notifier-modal-header">
            <h2>
              Obavještenje{' '}
              <CiCircleInfo className="automatic-connection-notifier-information-icon" />
            </h2>
          </div>
          <div className="automatic-connection-notifier-modal-content">
            <p className="automatic-connection-notifier-description">
              Uspješno ste se povezali sa Vašim stručnjakom. Sada možete
              komunicirati sa njim tako što ćete rješavati zadane zadaće ili
              dijeliti sadržaj koji ste kreirali!
            </p>
          </div>
          <div className="automatic-connection-notifier-modal-actions">
            <button type="button">Zatvori</button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
