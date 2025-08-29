import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { register, getDbRoles } from '../../redux-toolkit/features/userSlice'
import { getMentalHealthExperts } from '../../redux-toolkit/features/mentalExpertSlice'
import { setSelectedMentalHealthExpertIds } from '../../redux-toolkit/features/therapySlice'
import useFetchLocationState from '../../custom/hooks/useFetchLocationState'
import {
  previewImage,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'
import { db_roles } from '../../enums/roles'
import { toast } from 'react-toastify'

import { MentalHealthExpertsDropdown } from '../MentalHealthExpertsDropdown/MentalHealthExpertsDropdown'
import { TiArrowSortedDown } from 'react-icons/ti'

import RegisterCSS from './Register.css'

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user)
  let { suggestedMentalHealthExperts } = useSelector(
    (store) => store.mentalExpert
  )
  let { selectedMentalHealthExpertIds } = useSelector((store) => store.therapy)

  let { isMentalHealthExpert, isRegularUser } = useFetchLocationState()
  let [isInTherapy, setIsInTherapy] = useState(false)

  useEffect(() => {
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

      if (
        stringIsNullOrEmpty(username) ||
        stringIsNullOrEmpty(password) ||
        roles.length <= 0 ||
        stringIsNullOrEmpty(mentalHealthExpertFirstName) ||
        stringIsNullOrEmpty(mentalHealthExpertLastName) ||
        stringIsNullOrEmpty(mentalHealthExpertOrganization) ||
        stringIsNullOrEmpty(mentalHealthExpertEmail)
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

      if (
        stringIsNullOrEmpty(username) ||
        stringIsNullOrEmpty(password) ||
        roles.length <= 0 ||
        stringIsNullOrEmpty(firstName) ||
        stringIsNullOrEmpty(lastName) ||
        stringIsNullOrEmpty(email)
      ) {
        if (isInTherapy && suggestedMentalHealthExperts?.length > 0) {
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

    console.log('SEND DATA ', sendData)

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

    // console.log('Register object ', Object.fromEntries(form.entries()))

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
                  id="register-first-name"
                  type="text"
                  name="register-first-name"
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
                  id="register-last-name"
                  type="text"
                  name="register-last-name"
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
                  id="register-email"
                  type="text"
                  name="register-email"
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

                  <MentalHealthExpertsDropdown />

                  {/* <div
                    id="main-mental-health-expert-picker"
                    className="main-mental-health-expert-picker-shrinked"
                  >
                    {suggestedMentalHealthExperts?.map((expert) => {
                      let fullName = `${expert?.firstName} ${expert?.lastName}`
                      return (
                        <div
                          key={expert?.userId}
                          className="main-mental-health-expert-selected-picker-option"
                        >
                          <div className="main-mental-health-expert-picker-option main-mental-health-expert-picker-option-expanded">
                            <input
                              id="main-mental-health-expert-picker-option-id"
                              type="hidden"
                              placeholder={expert?.userId}
                              value={expert?.userId}
                            />
                            <span className="main-mental-health-expert-picker-option-name">
                              {fullName}{' '}
                            </span>
                            <button
                              className="main-mental-health-expert-picker-option-action picker-option-add-action"
                              type="button"
                              onClick={(e) => {
                                let mainMentalHealthExpertSelectedPickerOption =
                                  e.currentTarget.parentNode.parentNode

                                let pickedMentalHealthExpertId =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '#main-mental-health-expert-picker-option-id'
                                  ).value

                                let optionAddAction =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '.picker-option-add-action'
                                  )
                                let optionCancelAction =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '.picker-option-cancel-action'
                                  )

                                let selectedMentalHealthExpertIdsTemp = [
                                  ...selectedMentalHealthExpertIds,
                                ]

                                mainMentalHealthExpertSelectedPickerOption.classList.add(
                                  'main-mental-health-expert-selected-picker-option-active'
                                )

                                optionAddAction.style.display = 'none'
                                optionCancelAction.style.display = 'initial'

                                selectedMentalHealthExpertIdsTemp = [
                                  ...selectedMentalHealthExpertIdsTemp,
                                  parseInt(pickedMentalHealthExpertId),
                                ]

                                setSelectedMentalHealthExpertIds(
                                  selectedMentalHealthExpertIdsTemp
                                )
                                return
                              }}
                            >
                              + Add
                            </button>
                            <button
                              className="main-mental-health-expert-picker-option-action picker-option-cancel-action"
                              type="button"
                              onClick={(e) => {
                                let mainMentalHealthExpertSelectedPickerOption =
                                  e.currentTarget.parentNode.parentNode

                                let pickedMentalHealthExpertId =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '#main-mental-health-expert-picker-option-id'
                                  ).value

                                let optionAddAction =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '.picker-option-add-action'
                                  )
                                let optionCancelAction =
                                  mainMentalHealthExpertSelectedPickerOption.querySelector(
                                    '.picker-option-cancel-action'
                                  )

                                let selectedMentalHealthExpertIdsTemp = [
                                  ...selectedMentalHealthExpertIds,
                                ]

                                mainMentalHealthExpertSelectedPickerOption.classList.remove(
                                  'main-mental-health-expert-selected-picker-option-active'
                                )

                                optionCancelAction.style.display = 'none'
                                optionAddAction.style.display = 'initial'

                                selectedMentalHealthExpertIdsTemp = [
                                  ...selectedMentalHealthExpertIdsTemp,
                                ].filter(
                                  (mentalHealthExpert) =>
                                    mentalHealthExpert !==
                                    parseInt(pickedMentalHealthExpertId)
                                )

                                setSelectedMentalHealthExpertIds(
                                  selectedMentalHealthExpertIdsTemp
                                )
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div> */}
                </div>
              </div>
            )}

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
