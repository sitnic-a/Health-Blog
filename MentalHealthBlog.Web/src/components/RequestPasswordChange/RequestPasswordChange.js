import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { requestPasswordChange } from '../../redux-toolkit/features/userSlice'
import {
  setEmailValidationData,
  setUsernameValidationData,
} from '../../redux-toolkit/features/validationSlice'
import {
  checkEmailValidity,
  checkUsernameValidity,
} from '../../utils/helper-methods/methods'

import RequestPasswordChangeCSS from './RequestPasswordChange.css'
import { TailSpin } from 'react-loader-spinner'
import { ReceivedEmailPopup } from '../ReceivedEmailPopup/ReceivedEmailPopup'
import { openEmailSuccessfullySentOpen } from '../../redux-toolkit/features/modalSlice'

export const RequestPasswordChange = () => {
  let dispatch = useDispatch()
  let { emailSentSuccesfullyOpen } = useSelector((store) => store.modal)
  let { usernameValidationData, emailValidationData } = useSelector(
    (store) => store.validation
  )

  let callRequestPasswordChange = () => {
    let username = document.getElementsByTagName('input')[0].value
    let [usernameIsvalid, usernameValidationMessages] = checkUsernameValidity(
      username,
      []
    )
    dispatch(
      setUsernameValidationData({
        usernameIsvalid,
        usernameValidationMessages,
      })
    )

    let email = document.getElementsByTagName('input')[1].value
    let isMentalHealthExpert = false // should change to be isRequired

    let [emailIsvalid, emailValidationMessages] = checkEmailValidity(
      email,
      [],
      isMentalHealthExpert
    )
    dispatch(setEmailValidationData({ emailIsvalid, emailValidationMessages }))

    if (!usernameIsvalid || !emailIsvalid) {
      toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    let objectWithData = {
      request: {
        username: username,
        email: email,
      },
    }

    dispatch(requestPasswordChange(objectWithData)).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode === 200) {
        dispatch(openEmailSuccessfullySentOpen(!emailSentSuccesfullyOpen))
      }
    })
  }
  return (
    <section id="request-password-change-main-container">
      <ReceivedEmailPopup />

      <div className="request-password-change-username-container">
        <label className="form-field-label">
          Unesite svoj username: <span className="required-field"> *</span>
        </label>

        <input
          type="text"
          className="form-field"
          placeholder="Unesite Vaš username..."
          autoFocus
          onBlur={(e) => {
            let username = e.currentTarget.value
            let [usernameIsvalid, usernameValidationMessages] =
              checkUsernameValidity(username, [])
            dispatch(
              setUsernameValidationData({
                usernameIsvalid,
                usernameValidationMessages,
              })
            )
          }}
        />
      </div>

      {!usernameValidationData?.usernameIsValid && (
        <div className="validation-message-main-container">
          {usernameValidationData?.usernameValidationMessages?.map(
            (message, index) => {
              return (
                <p key={index} className="validation-message">
                  - {message}
                </p>
              )
            }
          )}
        </div>
      )}

      <div className="request-password-change-email-container">
        <label className="form-field-label">
          Unesite svoju email adresu: <span className="required-field"> *</span>
        </label>

        <input
          type="text"
          className="form-field"
          placeholder="Unesite Vašu email adresu..."
          autoFocus
          onBlur={(e) => {
            let email = e.target.value
            let isMentalHealthExpert = false // should change to be isRequired
            let [emailIsvalid, emailValidationMessages] = checkEmailValidity(
              email,
              [],
              isMentalHealthExpert
            )
            dispatch(
              setEmailValidationData({ emailIsvalid, emailValidationMessages })
            )
          }}
        />

        {!emailValidationData?.emailIsValid && (
          <div className="validation-message-main-container">
            {emailValidationData?.emailValidationMessages?.map(
              (message, index) => {
                return (
                  <p key={index} className="validation-message">
                    - {message}
                  </p>
                )
              }
            )}
          </div>
        )}
      </div>

      <div className="request-password-change-footer">
        <p className="request-password-change-footer-description">
          Kako biste promijenili password potrebno je da prvo unesete Vašu email
          adresu na koju će Vam stići link za promjenu passworda
        </p>
      </div>

      <div className="request-password-change-send-request">
        <button
          className="request-password-change-send-request-button"
          onClick={callRequestPasswordChange}
        >
          Pošalji zahtjev
        </button>
        <span className="request-password-send-request-info-message">
          Slanje u toku...
          <span>
            <TailSpin height="30" width="30" />
          </span>
        </span>
      </div>
    </section>
  )
}
