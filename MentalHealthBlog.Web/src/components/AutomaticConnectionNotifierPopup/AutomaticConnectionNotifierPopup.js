import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
import { GoInfo } from 'react-icons/go'
import { application } from '../../application'

import AutomaticConnectionNotifierPopupCSS from './AutomaticConnectionNotifierPopup.css'

export const AutomaticConnectionNotifiedPopup = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  console.log('Authenticated ', authenticatedUser)

  return (
    <section id="automatic-connection-notifier-main-container">
      <Modal
        // isOpen={
        //   authenticatedUser?.isRegularUserNotifiedAboutTherapyInviteAutomaticConnection
        // }
        isOpen={true}
        appElement={document.getElementById('root')}
        style={application.trial_period_style}
        onRequestClose={() => {
          //Pozvati metodu za setanje novog statea autoconnnotifiera
        }}
      >
        <div className="automatic-connection-notifier-modal">
          <div className="automatic-connection-notifier-modal-header">
            <h2 className="automatic-connection-notifier-header-title">
              Obavještenje{' '}
              <GoInfo className="automatic-connection-notifier-information-icon" />
            </h2>
          </div>
          <div className="automatic-connection-notifier-modal-content">
            <p className="automatic-connection-notifier-description">
              Uspješno ste se povezali sa Vašim stručnjakom [ime strucnjaka].
              Sada možete komunicirati sa njim tako što ćete rješavati zadane
              zadaće ili dijeliti sadržaj koji ste kreirali!
            </p>
          </div>
          <div className="automatic-connection-notifier-modal-actions">
            <button
              className="automatic-connection-notifier-action automatic-connection-notifier-action-close"
              type="button"
              onClick={() => {
                //Pozvati metodu za setanje novog statea autoconnnotifiera
              }}
            >
              Zatvori
            </button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
