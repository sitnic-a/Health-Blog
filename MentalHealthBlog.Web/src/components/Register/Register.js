import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { register, getDbRoles } from '../../redux-toolkit/features/userSlice'
import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'
import useFetchLocationState from '../../custom/hooks/useFetchLocationState'
import {
  previewImage,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'
import { db_roles } from '../../enums/roles'
import { toast } from 'react-toastify'

import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti'

import RegisterCSS from './Register.css'

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user)
  let { suggestedMentalHealthExperts } = useSelector(
    (store) => store.mentalExpert
  )
  let { isMentalHealthExpert } = useFetchLocationState()
  let [isInTherapy, setIsInTherapy] = useState(false)

  useEffect(() => {
    dispatch(getDbRoles())
    dispatch(getMentalHealthExperts())
  }, [])

  let navigate = useNavigate()
  let dispatch = useDispatch()

  let registerUser = async (e) => {
    e.preventDefault()
    let roles = []
    let selectedRoles = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    )

    if (isMentalHealthExpert === true) {
      roles.push(db_roles.PSYCHOLOGIST)
    } else {
      selectedRoles.forEach((role) => {
        roles.push(role.value)
      })
    }

    let sendData
    let username = document.getElementById('register-username').value
    let password = document.getElementById('register-password').value
    let mentalHealthExpertFirstName
    let mentalHealthExpertLastName
    let mentalHealthExpertOrganization
    let mentalHealthExpertPhoneNumber
    let mentalHealthExpertEmail
    let mentalHealthExpertPhoto

    sendData = {
      username: username,
      password: password,
      roles: roles,
    }

    console.log('SEND DATA ', sendData)

    if (isMentalHealthExpert === true) {
      mentalHealthExpertFirstName = document.getElementById(
        'register-mental-health-expert-first-name'
      ).value
      mentalHealthExpertLastName = document.getElementById(
        'register-mental-health-expert-last-name'
      ).value
      mentalHealthExpertOrganization = document.getElementById(
        'register-mental-health-expert-organization'
      ).value
      mentalHealthExpertPhoneNumber = document.getElementById(
        'register-mental-health-expert-phone-number'
      ).value
      mentalHealthExpertEmail = document.getElementById(
        'register-mental-health-expert-email'
      ).value
      mentalHealthExpertPhoto = document.getElementById(
        'register-mental-health-expert-photo'
      ).files[0]

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

      console.log('SEND DATA 2 ', sendData)
    }

    let form = new FormData()
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
      }
    }

    console.log('Form ', form)

    if (isMentalHealthExpert === true) {
      if (
        stringIsNullOrEmpty(form.get('username')) ||
        stringIsNullOrEmpty(form.get('password')) ||
        form.get('roles').length <= 0 ||
        stringIsNullOrEmpty(sendData.mentalHealthExpert.firstName) ||
        stringIsNullOrEmpty(sendData.mentalHealthExpert.lastName) ||
        stringIsNullOrEmpty(sendData.mentalHealthExpert.organization) ||
        stringIsNullOrEmpty(sendData.mentalHealthExpert.phoneNumber)
      ) {
        toast.error(
          'Something went wrong! Please check are all fields populated',
          {
            autoClose: 1500,
            position: 'bottom-right',
          }
        )
        return
      }
    }

    if (isMentalHealthExpert !== true) {
      if (
        stringIsNullOrEmpty(form.get('username')) ||
        stringIsNullOrEmpty(form.get('password')) ||
        form.get('roles').length <= 0
      ) {
        toast.error(
          'Something went wrong! Please check are all fields populated',
          {
            autoClose: 1500,
            position: 'bottom-right',
          }
        )
        return
      }
    }

    dispatch(register(form)).then((response) => {
      let statusCode = response.payload.statusCode
      if (statusCode === 201) {
        navigate('/login')
      }
    })
  }

  return (
    <section id="register-container">
      <h1>Populate required fields to continue...</h1>
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
              placeholder="Enter your username"
              autoComplete="true"
            />
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
            />
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
                  First Name:
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter your first name..."
                />
              </div>

              <div className="register-info-last-name-container">
                <label
                  htmlFor="register-last-name"
                  className="form-field-label"
                >
                  Last Name:
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter your last name..."
                />
              </div>

              <div className="register-info-email-container">
                <label htmlFor="register-email" className="form-field-label">
                  Email:
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="text"
                  className="form-field"
                  placeholder="Enter your email..."
                />
              </div>
            </div>

            <div className="register-info-in-therapy-container">
              <label htmlFor="register-in-therapy" className="form-field-label">
                In therapy?
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

            {isInTherapy && (
              <div className="select-mental-health-experts-main-container">
                <label className="form-field-label">
                  Choose your expert(s):
                </label>
                <span className="required-field"> *</span>
                <p className="select-mental-health-experts-main-container-important-note">
                  NOTE: You can choose the max of 2 experts at time...
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
                    Main expert{' '}
                    <TiArrowSortedDown
                      id="main-mental-health-expert-expand-icon"
                      className="main-mental-health-expert-expand-icon"
                    />
                  </label>
                  <div
                    id="main-mental-health-expert-picker"
                    className="main-mental-health-expert-picker-shrinked"
                  >
                    {suggestedMentalHealthExperts?.map((expert) => {
                      let fullName = `${expert?.firstName} ${expert?.lastName}`
                      return (
                        <div className="main-mental-health-expert-selected-picker-option">
                          <div className="main-mental-health-expert-picker-option main-mental-health-expert-picker-option-expanded">
                            <span className="main-mental-health-expert-picker-option-name">
                              {fullName}{' '}
                            </span>
                            <button
                              className="main-mental-health-expert-picker-option-action picker-option-add-action"
                              type="button"
                              onClick={(e) => {
                                let mainMentalHealthExpertSelectedPickerOption =
                                  e.currentTarget.parentNode.parentNode
                                console.log(
                                  'Main ',
                                  mainMentalHealthExpertSelectedPickerOption
                                )

                                mainMentalHealthExpertSelectedPickerOption.classList.toggle(
                                  'main-mental-health-expert-selected-picker-option-active'
                                )
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <div>
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
            </div>
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
                  First name:
                </label>
                <span className="required-field"> *</span>

                <input
                  id="register-mental-health-expert-first-name"
                  name="register-mental-health-expert-first-name"
                  className="form-field"
                  type="text"
                  placeholder="Enter your first name: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info last-name">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-last-name"
                >
                  Last name:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-last-name"
                  name="register-mental-health-expert-last-name"
                  type="text"
                  placeholder="Enter your last name: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info organization">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-organization"
                >
                  Organization:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-organization"
                  name="register-mental-health-expert-organization"
                  type="text"
                  placeholder="Enter your organization: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info phone-number">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-phone-number"
                >
                  Phone number:
                </label>
                <span className="required-field"> *</span>

                <input
                  className="form-field"
                  id="register-mental-health-expert-phone-number"
                  name="register-mental-health-expert-phone-number"
                  type="text"
                  placeholder="Enter your phone number: "
                ></input>
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
                  placeholder="Enter your email: "
                ></input>
              </div>
            </div>

            <div className="mental-health-expert-photo-container">
              <div className="mental-health-expert-register-info photo">
                <label
                  className="form-field-label"
                  htmlFor="register-mental-health-expert-photo"
                >
                  Photo:{' '}
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
