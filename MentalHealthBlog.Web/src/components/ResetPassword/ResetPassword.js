import { useSelector } from 'react-redux'
import { Password } from '../shared/Password/Password'

import ResetPasswordCSS from './ResetPassword.css'
export const ResetPassword = () => {
  let { passwordResetEmail } = useSelector((store) => store.user)

  console.log('Password reset email ', passwordResetEmail)

  return (
    <section id="reset-password-main-container">
      <div className="reset-password-header">
        <h1>Promjena passworda</h1>
      </div>

      <div className="reset-password-content">
        <Password />

        <div className="confirmation-password-main-container">
          <label htmlFor="password" className="form-field-label">
            Potvrda passworda: <span className="required-field"> *</span>
          </label>

          <Password />
        </div>
      </div>
    </section>
  )
}
