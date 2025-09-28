import { useDispatch, useSelector } from 'react-redux'
import { checkEmailValidity } from '../../utils/helper-methods/methods'
import RequestPasswordChangeCSS from './RequestPasswordChange.css'
import { setEmailValidationData } from '../../redux-toolkit/features/validationSlice'

export const RequestPasswordChange = () => {
  let dispatch = useDispatch()
  let { emailValidationData } = useSelector((store) => store.validation)
  return (
    <section id="request-password-change-main-container">
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
        <button className="request-password-change-send-request-button">
          Pošalji zahtjev
        </button>
      </div>
    </section>
  )
}
