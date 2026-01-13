import { useDispatch, useSelector } from 'react-redux'
import Modal, { prototype } from 'react-modal'
import { GoInfo } from 'react-icons/go'
import { application } from '../../application'

import AutomaticConnectionNotifierPopupCSS from './AutomaticConnectionNotifierPopup.css'
import { useEffect } from 'react'
import {
  getRegularUserUnnotifiedAutomaticConnectionTherapyInvites,
  markRegularUserAutomaticConnectionAsNotified,
} from '../../redux-toolkit/features/therapySlice'

export const AutomaticConnectionNotifiedPopup = () => {
  let dispatch = useDispatch()
  let {
    unnotifiedAutomaticConnectionTherapyInvites,
    unnotifiedAutomaticConnectionExists,
  } = useSelector((store) => store.therapy)

  let fullName = String.prototype.concat(
    unnotifiedAutomaticConnectionTherapyInvites[0]?.mentalHealthExpertFirstName,
    ' ',
    unnotifiedAutomaticConnectionTherapyInvites[0]?.mentalHealthExpertLastName
  )

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  console.log('Authenticated ', authenticatedUser)

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(
      getRegularUserUnnotifiedAutomaticConnectionTherapyInvites(objectWithData)
    )
  }, [])

  return (
    <section id="automatic-connection-notifier-main-container">
      <Modal
        // isOpen={
        //   authenticatedUser?.isRegularUserNotifiedAboutTherapyInviteAutomaticConnection
        // }

        isOpen={unnotifiedAutomaticConnectionExists}
        appElement={document.getElementById('root')}
        style={application.trial_period_style}
        onRequestClose={() => {
          //Pozvati metodu za setanje novog statea autoconnnotifiera
          let objectWithData = {
            authenticatedUser,
          }
          dispatch(markRegularUserAutomaticConnectionAsNotified(objectWithData))
        }}
        onAfterClose={() => {
          let objectWithData = {
            authenticatedUser,
          }
          dispatch(markRegularUserAutomaticConnectionAsNotified(objectWithData))
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
              Uspješno ste se povezali sa Vašim stručnjakom{' '}
              <strong className="automatic-connection-notifier-description-fullname">
                {fullName}
              </strong>
              . Sada možete komunicirati sa njim tako što ćete rješavati zadane
              zadaće ili dijeliti sadržaj koji ste kreirali!
            </p>
          </div>
          <div className="automatic-connection-notifier-modal-actions">
            <button
              className="automatic-connection-notifier-action automatic-connection-notifier-action-close"
              type="button"
              onClick={() => {
                //Pozvati metodu za setanje novog statea autoconnnotifiera
                let objectWithData = {
                  authenticatedUser,
                }
                dispatch(
                  markRegularUserAutomaticConnectionAsNotified(objectWithData)
                )
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
