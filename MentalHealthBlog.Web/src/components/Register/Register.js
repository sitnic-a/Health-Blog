import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { register, getDbRoles } from '../../redux-toolkit/features/userSlice'
import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'
import { setSelectedMentalHealthExpertIds } from '../../redux-toolkit/features/therapySlice'
import useFetchLocationState from '../../custom/hooks/useFetchLocationState'
import {
  checkEmailValidity,
  checkPasswordValidity,
  checkPersonalInformationValidity,
  checkPhoneNumberValidity,
  checkUsernameValidity,
  previewImage,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'
import { db_roles } from '../../enums/roles'
import { toast } from 'react-toastify'

import { MentalHealthExpertsDropdown } from '../MentalHealthExpertsDropdown/MentalHealthExpertsDropdown'
import { TiArrowSortedDown } from 'react-icons/ti'

import RegisterCSS from './Register.css'
import ValidationCSS from '../shared/Validation/Validation.css'

import {
  setPasswordValidationData,
  setUsernameValidationData,
  setFirstNameValidationData,
  setLastNameValidationData,
  setOrganizationValidationData,
  setPhoneNumberValidationData,
  setEmailValidationData,
} from '../../redux-toolkit/features/validationSlice'

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user)
  let { suggestedMentalHealthExperts } = useSelector(
    (store) => store.mentalExpert
  )
  let { selectedMentalHealthExpertIds } = useSelector((store) => store.therapy)

  let { isMentalHealthExpert, isRegularUser } = useFetchLocationState()
  let [isInTherapy, setIsInTherapy] = useState(false)
  let {
    usernameValidationData,
    passwordValidationData,
    firstNameValidationData,
    lastNameValidationData,
    organizationValidationData,
    phoneNumberValidationData,
    emailValidationData,
  } = useSelector((store) => store.validation)

  let resetValidationData = () => {
    dispatch(setUsernameValidationData({}))
    dispatch(setPasswordValidationData({}))
    dispatch(setFirstNameValidationData({}))
    dispatch(setLastNameValidationData({}))
    dispatch(setOrganizationValidationData({}))
    dispatch(setPhoneNumberValidationData({}))
    dispatch(setEmailValidationData({}))
  }

  useEffect(() => {
    resetValidationData()
    dispatch(getDbRoles())
    dispatch(getMentalHealthExperts(null))
  }, [])

  let navigate = useNavigate()
  let dispatch = useDispatch()

  let registerUser = async (e) => {
    e.preventDefault()
    let roles = []
    let selectedRoles = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    )

    let sendData
    let form = new FormData()
    let username = document.getElementById('register-username').value
    let password = document.getElementById('register-password').value

    if (isMentalHealthExpert === true) {
      let mentalHealthExpertFirstName = document.getElementById(
        'register-mental-health-expert-first-name'
      ).value
      let mentalHealthExpertLastName = document.getElementById(
        'register-mental-health-expert-last-name'
      ).value
      let mentalHealthExpertOrganization = document.getElementById(
        'register-mental-health-expert-organization'
      ).value
      let mentalHealthExpertPhoneNumber = document.getElementById(
        'register-mental-health-expert-phone-number'
      ).value
      let mentalHealthExpertEmail = document.getElementById(
        'register-mental-health-expert-email'
      ).value
      let mentalHealthExpertPhoto = document.getElementById(
        'register-mental-health-expert-photo'
      ).files[0]

      roles.push(db_roles.PSYCHOLOGIST)

      let [usernameIsValid, usernameValidationMessages] = checkUsernameValidity(
        username,
        []
      )
      dispatch(
        setUsernameValidationData({
          usernameIsValid,
          usernameValidationMessages,
        })
      )

      let [passwordIsValid, passwordValidationMessages] = checkPasswordValidity(
        password,
        []
      )
      dispatch(
        setPasswordValidationData({
          passwordIsValid,
          passwordValidationMessages,
        })
      )

      let isOrganization = false
      let [firstNameIsValid, firstNameValidationMessages] =
        checkPersonalInformationValidity(
          mentalHealthExpertFirstName,
          [],
          isOrganization
        )

      dispatch(
        setFirstNameValidationData({
          firstNameIsValid,
          firstNameValidationMessages,
        })
      )

      let [lastNameIsValid, lastNameValidationMessages] =
        checkPersonalInformationValidity(
          mentalHealthExpertLastName,
          [],
          isOrganization
        )
      dispatch(
        setLastNameValidationData({
          lastNameIsValid,
          lastNameValidationMessages,
        })
      )

      isOrganization = true
      let [organizationIsValid, organizationValidationMessages] =
        checkPersonalInformationValidity(
          mentalHealthExpertOrganization,
          [],
          isOrganization
        )
      dispatch(
        setOrganizationValidationData({
          organizationIsValid,
          organizationValidationMessages,
        })
      )

      let [phoneNumberIsValid, phoneNumberValidationMessages] =
        checkPhoneNumberValidity(mentalHealthExpertPhoneNumber, [])
      dispatch(
        setPhoneNumberValidationData({
          phoneNumberIsValid,
          phoneNumberValidationMessages,
        })
      )

      let [emailIsValid, emailValidationMessages] = checkEmailValidity(
        mentalHealthExpertEmail,
        [],
        isMentalHealthExpert
      )
      dispatch(
        setEmailValidationData({ emailIsValid, emailValidationMessages })
      )

      if (
        stringIsNullOrEmpty(username) ||
        !usernameIsValid ||
        stringIsNullOrEmpty(password) ||
        !passwordIsValid ||
        roles.length <= 0 ||
        stringIsNullOrEmpty(mentalHealthExpertFirstName) ||
        !firstNameIsValid ||
        stringIsNullOrEmpty(mentalHealthExpertLastName) ||
        !lastNameIsValid ||
        stringIsNullOrEmpty(mentalHealthExpertOrganization) ||
        !organizationIsValid ||
        stringIsNullOrEmpty(mentalHealthExpertPhoneNumber) ||
        !phoneNumberIsValid ||
        // stringIsNullOrEmpty(mentalHealthExpertEmail) ||
        !emailIsValid
      ) {
        toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
          autoClose: 3000,
          position: 'bottom-right',
        })
        return
      }

      sendData = {
        username: username,
        password: password,
        roles: roles,
        isMentalHealthExpert: isMentalHealthExpert,
        mentalHealthExpert: {
          firstName: mentalHealthExpertFirstName,
          lastName: mentalHealthExpertLastName,
          organization: mentalHealthExpertOrganization,
          phoneNumber: mentalHealthExpertPhoneNumber,
          email: mentalHealthExpertEmail,
        },
        photo: mentalHealthExpertPhoto,
      }
    } else {
      let firstName = document.getElementById('register-first-name').value
      let lastName = document.getElementById('register-last-name').value
      let email = document.getElementById('register-email').value
      roles.push(db_roles.USER)

      let [usernameIsValid, usernameValidationMessages] = checkUsernameValidity(
        username,
        []
      )
      dispatch(
        setUsernameValidationData({
          usernameIsValid,
          usernameValidationMessages,
        })
      )

      let [passwordIsValid, passwordValidationMessages] = checkPasswordValidity(
        password,
        []
      )
      dispatch(
        setPasswordValidationData({
          passwordIsValid,
          passwordValidationMessages,
        })
      )

      let isOrganization = false

      let [firstNameIsValid, firstNameValidationMessages] =
        checkPersonalInformationValidity(firstName, [], isOrganization)
      dispatch(
        setFirstNameValidationData({
          firstNameIsValid,
          firstNameValidationMessages,
        })
      )

      let [lastNameIsValid, lastNameValidationMessages] =
        checkPersonalInformationValidity(lastName, [], isOrganization)
      dispatch(
        setLastNameValidationData({
          lastNameIsValid,
          lastNameValidationMessages,
        })
      )

      let [emailIsValid, emailValidationMessages] = checkEmailValidity(
        email,
        [],
        isMentalHealthExpert
      )
      dispatch(
        setEmailValidationData({ emailIsValid, emailValidationMessages })
      )

      if (
        // stringIsNullOrEmpty(username) ||
        !usernameValidationData?.usernameIsValid ||
        // stringIsNullOrEmpty(password) ||
        !passwordValidationData?.passwordIsValid ||
        roles.length <= 0 ||
        stringIsNullOrEmpty(firstName) ||
        !firstNameValidationData?.firstNameIsValid ||
        stringIsNullOrEmpty(lastName) ||
        !lastNameValidationData?.lastNameIsValid ||
        stringIsNullOrEmpty(email) ||
        !emailValidationData?.emailIsValid
      ) {
        toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
          autoClose: 3000,
          position: 'bottom-right',
        })
        return
      } else {
        if (
          isInTherapy &&
          suggestedMentalHealthExperts?.length > 0 &&
          selectedMentalHealthExpertIds?.length <= 0
        ) {
          toast.error('Molimo označite maksimalno dva stručnjaka!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
      }

      if (isInTherapy) {
        sendData = {
          username,
          password,
          regularUser: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            isInTherapy: isInTherapy,
            mentalHealthExpertsToConnectWithIds: selectedMentalHealthExpertIds,
          },
          isMentalHealthExpert: false,
          roles,
        }
      } else {
        sendData = {
          username,
          password,
          regularUser: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            isInTherapy: isInTherapy,
            mentalHealthExpertsToConnectWithIds: [],
          },
          isMentalHealthExpert: false,
          roles,
        }
      }
    }

    for (let dataKey in sendData) {
      if (dataKey === 'mentalHealthExpert') {
        for (let previewKey in sendData[dataKey]) {
          form.append(
            `mentalHealthExpert[${previewKey}]`,
            sendData[dataKey][previewKey]
          )
        }
      } else {
        form.append(dataKey, sendData[dataKey])
        if (dataKey === 'regularUser') {
          for (let previewKey in sendData[dataKey]) {
            form.append(
              `regularUser[${previewKey}]`,
              sendData[dataKey][previewKey]
            )
          }
        }
      }
    }

    dispatch(register(form)).then((response) => {
      let statusCode = response.payload.statusCode
      if (statusCode === 201) {
        dispatch(setSelectedMentalHealthExpertIds([]))
        navigate('/login')
      }
    })

    // selectedRoles.forEach((role) => {
    //   roles.push(role.value)
    // })
  }

  return (
    <section id="register-container">
      <h1>Registracija novog korisnika</h1>
      <p className="required-field">Polja obavezna za unos *</p>
      <form onSubmit={registerUser} encType="multipart/form-data">
        <div className="register-credentials-container">
          <div>
            <label className="form-field-label" htmlFor="register-username">
              Username:
            </label>
            <span className="required-field"> *</span>
            <input
              name="username"
              id="register-username"
              className="form-field"
              type="text"
              placeholder="Unesite username..."
              autoComplete="true"
              onBlur={(e) => {
                let username = e.target.value
                let [usernameIsValid, usernameValidationMessages] =
                  checkUsernameValidity(username, [])

                dispatch(
                  setUsernameValidationData({
                    usernameIsValid,
                    usernameValidationMessages,
                  })
                )
              }}
            />

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
          </div>

          <div>
            <label className="form-field-label" htmlFor="register-password">
              Password:
            </label>
            <span className="required-field"> *</span>

            <input
              name="password"
              id="register-password"
              className="form-field"
              type="password"
              placeholder="Unesite password..."
              onBlur={(e) => {
                let password = e.target.value
                let [isValid, passwordValidationMessages] =
                  checkPasswordValidity(password, [])

                dispatch(
                  setPasswordValidationData({
                    passwordIsValid: isValid,
                    passwordValidationMessages,
                  })
                )
              }}
            />

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
        </div>
        {isMentalHealthExpert !== true && (
          <div className="register-info-main-container">
            <div className="register-info-more-info">
              <div className="register-info-first-name-container">
                <label
                  htmlFor="register-first-name"
                  className="form-field-label"
                >
                  Ime:
                  <span className="required-field"> *</span>
                </label>
                <input
                  id="register-first-name"
                  type="text"
                  name="register-first-name"
                  className="form-field"
                  placeholder="Unesite svoje ime..."
                  onBlur={(e) => {
                    let firstName = e.target.value
                    let isOrganization = false
                    let [isValid, validationMessages] =
                      checkPersonalInformationValidity(
                        firstName,
                        [],
                        isOrganization
                      )

                    dispatch(
                      setFirstNameValidationData({
                        firstNameIsValid: isValid,
                        firstNameValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!firstNameValidationData?.firstNameIsValid && (
                  <div className="validation-message-main-container">
                    {firstNameValidationData?.firstNameValidationMessages?.map(
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

              <div className="register-info-last-name-container">
                <label
                  htmlFor="register-last-name"
                  className="form-field-label"
                >
                  Prezime:
                  <span className="required-field"> *</span>
                </label>
                <input
                  id="register-last-name"
                  type="text"
                  name="register-last-name"
                  className="form-field"
                  placeholder="Unesite svoje prezime..."
                  onBlur={(e) => {
                    let lastName = e.target.value
                    let isOrganization = false
                    let [isValid, validationMessages] =
                      checkPersonalInformationValidity(
                        lastName,
                        [],
                        isOrganization
                      )
                    dispatch(
                      setLastNameValidationData({
                        lastNameIsValid: isValid,
                        lastNameValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!lastNameValidationData?.lastNameIsValid && (
                  <div className="validation-message-main-container">
                    {lastNameValidationData?.lastNameValidationMessages?.map(
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

              <div className="register-info-email-container">
                <label htmlFor="register-email" className="form-field-label">
                  Email:
                  <span className="required-field"> *</span>
                </label>
                <input
                  id="register-email"
                  type="text"
                  name="register-email"
                  className="form-field"
                  placeholder="Unesite svoj email..."
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
            </div>

            {suggestedMentalHealthExperts?.length > 0 && (
              <div className="register-info-in-therapy-container">
                <label
                  htmlFor="register-in-therapy"
                  className="form-field-label"
                >
                  Da li idete na terapiju?
                </label>
                <input
                  className="register-in-therapy-checkbox"
                  type="checkbox"
                  checked={isInTherapy}
                  onChange={() => {
                    setIsInTherapy(!isInTherapy)
                  }}
                />
              </div>
            )}

            {isInTherapy && (
              <div className="select-mental-health-experts-main-container">
                <label className="form-field-label">
                  Odaberite eksperta(e):
                </label>
                <span className="required-field"> *</span>
                <p className="select-mental-health-experts-main-container-important-note">
                  BITNO: Moguće je odabrati maksimalno dva stručnjaka
                </p>

                <div className="main-mental-health-expert-picker-container">
                  <label
                    className="form-field-label main-mental-health-expert-picker-choose-label"
                    onClick={() => {
                      let mainMentalHealthExpertPicker =
                        document.getElementById(
                          'main-mental-health-expert-picker'
                        )
                      let mainMentalHealthExpertExpandIcon =
                        document.getElementById(
                          'main-mental-health-expert-expand-icon'
                        )

                      if (
                        mainMentalHealthExpertPicker.classList.contains(
                          'main-mental-health-expert-picker-shrinked'
                        )
                      ) {
                        mainMentalHealthExpertPicker.classList.remove(
                          'main-mental-health-expert-picker-shrinked'
                        )
                        mainMentalHealthExpertExpandIcon.classList.remove(
                          'main-mental-health-expert-expand-icon'
                        )

                        mainMentalHealthExpertPicker.classList.add(
                          'main-mental-health-expert-picker-expanded'
                        )
                        mainMentalHealthExpertExpandIcon.classList.add(
                          'main-mental-health-expert-expand-icon-clicked'
                        )
                      } else if (
                        mainMentalHealthExpertPicker.classList.contains(
                          'main-mental-health-expert-picker-expanded'
                        )
                      ) {
                        mainMentalHealthExpertPicker.classList.remove(
                          'main-mental-health-expert-picker-expanded'
                        )
                        mainMentalHealthExpertExpandIcon.classList.remove(
                          'main-mental-health-expert-expand-icon-clicked'
                        )

                        mainMentalHealthExpertPicker.classList.add(
                          'main-mental-health-expert-picker-shrinked'
                        )
                        mainMentalHealthExpertExpandIcon.classList.add(
                          'main-mental-health-expert-expand-icon'
                        )
                      }
                    }}
                  >
                    Odaberite stručnjaka iz liste
                    <TiArrowSortedDown
                      id="main-mental-health-expert-expand-icon"
                      className="main-mental-health-expert-expand-icon"
                    />
                  </label>

                  <MentalHealthExpertsDropdown />
                </div>
              </div>
            )}

            <div className="register-terms-and-conditions-container">
              <p>
                Klikom na dugme za registraciju prihvatate{' '}
                <Link to={'/terms-and-conditions'}> uslove korištenja</Link>{' '}
                aplikacije!
              </p>
            </div>
            {/* <div>
              <label className="form-field-label" htmlFor="register-roles">
                User type:
              </label>
              <br />
              {dbRoles?.length > 0 &&
                dbRoles?.map((role) => {
                  return (
                    <div key={role.id}>
                      <input
                        type="checkbox"
                        name="db-role"
                        id="db-role"
                        value={role.id}
                      />
                      <label
                        className="form-field-label"
                        htmlFor="db-role-name"
                      >
                        {role.name}
                      </label>
                      <br />
                    </div>
                  )
                })}
            </div> */}
          </div>
        )}

        {isMentalHealthExpert === true && (
          <div className="mental-health-expert-register-info-main-container">
            <div className="mental-health-expert-register-info-container">
              <div className="mental-health-expert-register-info name">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-first-name"
                >
                  Ime:
                </label>
                <span className="required-field"> *</span>

                <input
                  id="register-mental-health-expert-first-name"
                  name="register-mental-health-expert-first-name"
                  className="form-field"
                  type="text"
                  placeholder="Unesite svoje ime..."
                  onBlur={(e) => {
                    let firstName = e.target.value
                    let isOrganization = false
                    let [isValid, validationMessages] =
                      checkPersonalInformationValidity(
                        firstName,
                        [],
                        isOrganization
                      )

                    dispatch(
                      setFirstNameValidationData({
                        firstNameIsValid: isValid,
                        firstNameValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!firstNameValidationData?.firstNameIsValid && (
                  <div className="validation-message-main-container">
                    {firstNameValidationData?.firstNameValidationMessages?.map(
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

              <div className="mental-health-expert-register-info last-name">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-last-name"
                >
                  Prezime:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-last-name"
                  name="register-mental-health-expert-last-name"
                  type="text"
                  placeholder="Unesite svoje prezime..."
                  onBlur={(e) => {
                    let lastName = e.target.value
                    let isOrganization = false
                    let [isValid, validationMessages] =
                      checkPersonalInformationValidity(
                        lastName,
                        [],
                        isOrganization
                      )

                    dispatch(
                      setLastNameValidationData({
                        lastNameIsValid: isValid,
                        lastNameValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!lastNameValidationData?.lastNameIsValid && (
                  <div className="validation-message-main-container">
                    {lastNameValidationData?.lastNameValidationMessages?.map(
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

              <div className="mental-health-expert-register-info organization">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-organization"
                >
                  Organizacija:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-organization"
                  name="register-mental-health-expert-organization"
                  type="text"
                  placeholder="Unesite ime organizacije/firme..."
                  onBlur={(e) => {
                    let organization = e.target.value
                    let isOrganization = true
                    let [isValid, validationMessages] =
                      checkPersonalInformationValidity(
                        organization,
                        [],
                        isOrganization
                      )
                    dispatch(
                      setOrganizationValidationData({
                        organizationIsValid: isValid,
                        organizationValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!organizationValidationData?.organizationIsValid && (
                  <div className="validation-message-main-container">
                    {organizationValidationData?.organizationValidationMessages?.map(
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

              <div className="mental-health-expert-register-info phone-number">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-phone-number"
                >
                  Broj telefona:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-phone-number"
                  name="register-mental-health-expert-phone-number"
                  type="text"
                  placeholder="Unesite svoj broj telefona..."
                  onBlur={(e) => {
                    let phoneNumber = e.target.value
                    let [isValid, validationMessages] =
                      checkPhoneNumberValidity(phoneNumber, [])
                    dispatch(
                      setPhoneNumberValidationData({
                        phoneNumberIsValid: isValid,
                        phoneNumberValidationMessages: validationMessages,
                      })
                    )
                  }}
                />

                {!phoneNumberValidationData?.phoneNumberIsValid && (
                  <div className="validation-message-main-container">
                    {phoneNumberValidationData?.phoneNumberValidationMessages?.map(
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

              <div className="mental-health-expert-register-info email">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-email"
                >
                  Email:
                </label>

                <input
                  className="form-field"
                  id="register-mental-health-expert-email"
                  name="register-mental-health-expert-email"
                  type="email"
                  placeholder="Unesite svoj email..."
                  onBlur={(e) => {
                    let email = e.target.value
                    let isMentalHealthExpert = true
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
            </div>

            <div className="mental-health-expert-photo-container">
              <div className="mental-health-expert-register-info photo">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-photo"
                >
                  Fotografija:
                </label>
                <input
                  onChange={(e) => {
                    previewImage(e.target.files[0])
                  }}
                  accept="image/*"
                  multiple
                  id="register-mental-health-expert-photo"
                  type="file"
                ></input>
              </div>
              <div
                id="mental-health-expert-register-photo-main-container"
                className="mental-health-expert-register-photo-main-container"
              ></div>
            </div>
          </div>
        )}
        <button type="submit" id="register-container-button">
          Register
        </button>
      </form>
    </section>
  )
}
