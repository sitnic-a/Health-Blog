import { useDispatch, useSelector } from 'react-redux'
import { TailSpin } from 'react-loader-spinner'
import { sendInviteToRegularUser } from '../../../../redux-toolkit/features/mentalExpertSlice'
import { setEmailValidationData } from '../../../../redux-toolkit/features/validationSlice'
import { checkEmailValidity } from '../../../../utils/helper-methods/methods'
import { Navbar } from '../../../shared/Navbar/Navbar'
import { LoadingSpinner } from '../../../LoadingSpinner/LoadingSpinner'

import InviteRegularUserCSS from './InviteRegularUser.css'
import { toast } from 'react-toastify'

export const InviteRegularUser = () => {
  let dispatch = useDispatch()
  let { isLoading } = useSelector((store) => store.mentalExpert)
  let { emailValidationData } = useSelector((store) => store.validation)
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  return (
    <section id="invite-regular-user-main-container">
      <Navbar />

      <div className="invite-regular-user-container">
        <div className="invite-regular-user-header">
          <h1 className="invite-regular-user-header-title">
            Pozivnica za terapijski proces
          </h1>
          <p className="invite-regular-user-header-subtitle">
            Na ovoj sekciji aplikacije imate mogućnost da kao psiholog pozovete
            u terapijski proces nekoga ko je već registrovan ili da se osoba
            registruje na aplikaciju te se automatski poveže sa Vama.
          </p>
          <p className="invite-regular-user-header-subtitle">
            Potrebno je samo da unesete email osobe u polje ispod i da joj
            klikom na dugme "Pošalji" pošaljete poziv. Sve ostalo će aplikacija
            uraditi za Vas! Kada korisnik napravi profil ili klikne link sa svom
            emailu, dobiti ćete obavijest na Vaš email da ste se uspješno
            povezali
          </p>
        </div>

        <div className="invite-regular-user-call-container">
          {isLoading === true || (
            <>
              <div className="invite-regular-user-call-email-container">
                <p className="invite-regular-user-call-email-title">
                  Email adresa
                </p>
                <input
                  className="invite-regular-user-call-email-value form-field"
                  type="text"
                  placeholder="Unesite email adresu..."
                  onBlur={(e) => {
                    let email = e.target.value
                    let isMentalHealthExpert = false
                    let [isValid, validationMessages] = checkEmailValidity(
                      email,
                      [],
                      isMentalHealthExpert
                    )
                    dispatch(
                      setEmailValidationData({
                        emailIsValid: isValid,
                        emailValidationMessages: validationMessages,
                      })
                    )
                  }}
                />
              </div>

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
              {/* Invite validation data below */}

              <div className="invite-regular-user-call-actions-container">
                <button
                  className="invite-regular-user-action invite-regular-user-invite-action"
                  type="button"
                  onClick={() => {
                    authenticatedUserLocalStorage =
                      localStorage.getItem('authenticatedUser')
                    authenticatedUser = JSON.parse(
                      authenticatedUserLocalStorage
                    )

                    let sendEmailTo = document.querySelector(
                      '.invite-regular-user-call-email-value'
                    ).value

                    let isMentalHealthExpert = true

                    let [isValid, validationMessages] = checkEmailValidity(
                      sendEmailTo,
                      [],
                      isMentalHealthExpert
                    )
                    dispatch(
                      setEmailValidationData({
                        emailIsValid: isValid,
                        emailValidationMessages: validationMessages,
                      })
                    )

                    if (!emailValidationData?.emailIsValid) {
                      toast.error(
                        'Molimo slijedite upute prilikom popunjavanja polja!',
                        {
                          autoClose: 3000,
                          position: 'bottom-right',
                        }
                      )
                      return
                    }

                    let requestObj = {
                      mentalHealthExpertId: authenticatedUser?.id,
                      sendEmailTo: sendEmailTo,
                    }
                    let objectWithData = {
                      authenticatedUser,
                      requestObj,
                    }

                    console.log('Object with data IRU ', objectWithData)

                    dispatch(sendInviteToRegularUser(objectWithData))
                  }}
                >
                  Pošalji
                </button>
              </div>
            </>
          )}

          {isLoading === true && (
            <div className="invite-regular-user-processing-request-container">
              <span className="invite-regular-user-processing-request-text">
                Pozivnica se šalje, molimo sačekajte...{' '}
              </span>
              <TailSpin width={40} height={40} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
