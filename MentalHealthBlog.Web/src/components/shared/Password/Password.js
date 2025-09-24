import { useDispatch, useSelector } from 'react-redux'
import { setPasswordValidationData } from '../../../redux-toolkit/features/validationSlice'
import { checkPasswordValidity } from '../../../utils/helper-methods/methods'

import { IoMdEye, IoMdEyeOff } from 'react-icons/io'

import PasswordCSS from './Password.css'

export const Password = () => {
  let dispatch = useDispatch()
  let { passwordValidationData } = useSelector((store) => store.validation)

  return (
    <div>
      <label className="form-field-label" htmlFor="password">
        Password:
      </label>
      <span className="required-field"> *</span>

      <div className="password-container">
        <input
          name="password"
          id="password"
          className="form-field"
          type="password"
          placeholder="Unesite password..."
          onBlur={(e) => {
            let password = e.target.value
            let [isValid, passwordValidationMessages] = checkPasswordValidity(
              password,
              []
            )

            dispatch(
              setPasswordValidationData({
                passwordIsValid: isValid,
                passwordValidationMessages,
              })
            )
          }}
        />

        <div className="password-container-text-type-actions">
          <IoMdEye
            className="password-plain-text-type"
            onClick={(e) => {
              let passwordEyeIconOn = e.currentTarget
              let passwordEyeIconOff = document.querySelector('.password-type')
              let password = document.querySelector('#password')
              passwordEyeIconOn.style.display = 'none'
              passwordEyeIconOff.style.display = 'initial'
              password.type = 'text'
              return
            }}
          />
          <IoMdEyeOff
            className="password-type"
            onClick={(e) => {
              let passwordEyeIconOff = e.currentTarget
              let passwordEyeIconOn = document.querySelector(
                '.password-plain-text-type'
              )
              let password = document.querySelector('#password')
              passwordEyeIconOn.style.display = 'initial'
              passwordEyeIconOff.style.display = 'none'
              password.type = 'password'
              return
            }}
          />
        </div>
      </div>
      {!passwordValidationData?.isValid && (
        <div className="validation-message-main-container">
          {passwordValidationData?.passwordValidationMessages?.map(
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
  )
}
