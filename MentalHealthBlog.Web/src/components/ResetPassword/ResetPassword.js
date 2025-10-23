import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { changePassword } from '../../redux-toolkit/features/userSlice'
import { setConfirmationPasswordValidationData } from '../../redux-toolkit/features/validationSlice'
import { checkPasswordValidity } from '../../utils/helper-methods/methods'
import { Password } from '../shared/Password/Password'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'

import ResetPasswordCSS from './ResetPassword.css'

export const ResetPassword = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { confirmationPasswordValidationData } = useSelector(
    (store) => store.validation
  )

  let query = new URLSearchParams(window.location.search)
  let username = query.get('username')
  let email = query.get('email')
  let safe = query.get('safe')

  let callChangePassword = () => {
    let password = document.getElementById('password').value
    let confirmationPassword = document.getElementById(
      'confirmation-password'
    ).value

    if (password !== confirmationPassword) {
      toast.error('Passwordi moraju biti isti!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    let objectWithData = {
      username: username,
      email: email,
      blueprint: safe,
      password: password,
      confirmationPassword: confirmationPassword,
    }

    dispatch(changePassword(objectWithData)).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode === 200) {
        toast.success('Uspješno ste promijenili svoj password', {
          autoClose: 3000,
          position: 'bottom-right',
        })
        navigate('/')
        return
      }

      toast.error('Password nije promijenjen.Probajte ponovo!', {
        autoClose: 5000,
        position: 'bottom-right',
      })
      return
    })
  }

  return (
    <section id="reset-password-main-container">
      <div className="reset-password-header">
        <h1>Promjena passworda za {username}</h1>
      </div>

      <div className="reset-password-username">
        <label htmlFor="password" className="form-field-label">
          Username (vrijednost fiksna):
        </label>

        <input
          name="username"
          id="username"
          className="form-field"
          type="text"
          disabled={true}
          value={username}
        />
      </div>

      <div className="reset-password-content">
        <Password />

        <div className="confirmation-password-main-container">
          <label htmlFor="password" className="form-field-label">
            Potvrda passworda: <span className="required-field"> *</span>
          </label>

          <div className="password-container">
            <input
              name="password"
              id="confirmation-password"
              className="form-field"
              type="password"
              placeholder="Potvrdite password..."
              onBlur={(e) => {
                let confirmationPassword = e.target.value
                let [isValid, passwordValidationMessages] =
                  checkPasswordValidity(confirmationPassword, [])

                dispatch(
                  setConfirmationPasswordValidationData({
                    passwordIsValid: isValid,
                    passwordValidationMessages,
                  })
                )
              }}
            />

            <div className="password-container-text-type-actions">
              <IoMdEye
                className="confirmation-password-plain-text-type"
                onClick={(e) => {
                  let confirmationPasswordEyeIconOn = e.currentTarget
                  let confirmationPasswordEyeIconOff = document.querySelector(
                    '.confirmation-password-type'
                  )
                  let confirmationPassword = document.querySelector(
                    '#confirmation-password'
                  )
                  confirmationPasswordEyeIconOn.style.display = 'none'
                  confirmationPasswordEyeIconOff.style.display = 'initial'
                  confirmationPassword.type = 'text'
                  return
                }}
              />
              <IoMdEyeOff
                className="confirmation-password-type"
                onClick={(e) => {
                  let confirmationPasswordEyeIconOff = e.currentTarget
                  let confirmationPasswordEyeIconOn = document.querySelector(
                    '.confirmation-password-plain-text-type'
                  )
                  let confirmationPassword = document.querySelector(
                    '#confirmation-password'
                  )
                  confirmationPasswordEyeIconOn.style.display = 'initial'
                  confirmationPasswordEyeIconOff.style.display = 'none'
                  confirmationPassword.type = 'password'
                  return
                }}
              />
            </div>
          </div>
          {!confirmationPasswordValidationData?.isValid && (
            <div className="validation-message-main-container">
              {confirmationPasswordValidationData?.passwordValidationMessages?.map(
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

        <div className="reset-password-action-container">
          <button
            type="button"
            className="reset-password-save-changes-button"
            onClick={callChangePassword}
          >
            Snimi promjene
          </button>
        </div>
      </div>
    </section>
  )
}
