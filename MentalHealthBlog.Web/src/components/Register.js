import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { register, getDbRoles } from './redux-toolkit/features/userSlice'
import useFetchLocationState from './custom/hooks/useFetchLocationState'
import { db_roles } from './enums/roles'
import { previewImage } from './utils/helper-methods/methods'

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user)
  let { isMentalHealthExpert } = useFetchLocationState()

  useEffect(() => {
    dispatch(getDbRoles())
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

    let username = document.getElementById('register-username').value
    let password = document.getElementById('register-password').value
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

    let sendData = {
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

    if (
      form.get('username') === '' ||
      form.get('username') === null ||
      form.get('password') === '' ||
      form.get('password') === null ||
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

    dispatch(register(form)).then((response) => {
      let statusCode = response.payload.statusCode
      if (statusCode === 201) {
        navigate('/login')
      }
    })
  }

  return (
    <section className="register-container">
      <form onSubmit={registerUser} encType="multipart/form-data">
        <div>
          <label htmlFor="register-username">Username:</label>
          <input
            type="text"
            name="username"
            id="register-username"
            placeholder="Enter your username"
            autoComplete="true"
          />
        </div>

        <div>
          <label htmlFor="register-password">Password:</label>
          <input type="password" name="password" id="register-password" />
        </div>
        {isMentalHealthExpert !== true && (
          <div>
            <label htmlFor="register-roles">User type:</label>
            <br />
            {dbRoles.length > 0 &&
              dbRoles.map((role) => {
                return (
                  <div key={role.id}>
                    <input
                      type="checkbox"
                      name="db-role"
                      id="db-role"
                      value={role.id}
                    />
                    <label htmlFor="db-role-name">{role.name}</label>
                    <br />
                  </div>
                )
              })}
          </div>
        )}

        {isMentalHealthExpert === true && (
          <div className="mental-health-expert-register-info-main-container">
            <div className="mental-health-expert-register-info-container">
              <div className="mental-health-expert-register-info name">
                <label htmlFor="mental-health-expert-first-name">
                  First name:
                </label>
                <input
                  id="register-mental-health-expert-first-name"
                  name="mental-health-expert-first-name"
                  type="text"
                  placeholder="Enter your first name: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info last-name">
                <label htmlFor="mental-health-expert-last-name">
                  Last name:
                </label>
                <input
                  id="register-mental-health-expert-last-name"
                  name="mental-health-expert-last-name"
                  type="text"
                  placeholder="Enter your last name: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info organization">
                <label htmlFor="mental-health-expert-organization">
                  Organization:
                </label>
                <input
                  id="register-mental-health-expert-organization"
                  name="mental-health-expert-organization"
                  type="text"
                  placeholder="Enter your organization: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info phone-number">
                <label htmlFor="mental-health-expert-phone-number">
                  Phone number:
                </label>
                <input
                  id="register-mental-health-expert-phone-number"
                  name="mental-health-expert-phone-number"
                  type="text"
                  placeholder="Enter your phone number: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info email">
                <label htmlFor="mental-health-expert-email">Email:</label>
                <input
                  id="register-mental-health-expert-email"
                  name="mental-health-expert-email"
                  type="email"
                  placeholder="Enter your email: "
                ></input>
              </div>

              <div className="mental-health-expert-register-info photo">
                <label htmlFor="mental-health-expert-photo">Photo:</label>
                <input
                  onChange={(e) => {
                    previewImage(e.target.files[0])
                  }}
                  accept="image/*"
                  multiple
                  id="register-mental-health-expert-photo"
                  name="mental-health-expert-photo"
                  type="file"
                ></input>
              </div>
            </div>
            <div
              id="mental-health-expert-register-photo-main-container"
              className="mental-health-expert-register-photo-main-container"
            ></div>
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </section>
  )
}
