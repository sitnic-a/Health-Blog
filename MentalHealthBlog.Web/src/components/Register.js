import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { register, getDbRoles } from './redux-toolkit/features/userSlice'

export const Register = () => {
  let { dbRoles } = useSelector((store) => store.user)

  useEffect(() => {
    dispatch(getDbRoles())
  }, [])

  let navigate = useNavigate()
  let dispatch = useDispatch()

  let registerUser = async (e) => {
    e.preventDefault()
    console.log('Register invoked')
    let selectedRoles = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    )
    let roles = []
    selectedRoles.forEach((role) => {
      roles.push(role.value)
    })

    let form = new FormData(e.target)
    let formData = form.entries()
    let data = Object.fromEntries([...formData])

    let newUser = {
      username: data.username,
      password: data.password,
      roles: roles,
    }

    console.log('New user ', newUser)

    if (
      newUser.username === '' ||
      newUser.username === null ||
      newUser.password === '' ||
      newUser.password === null ||
      newUser.roles.length <= 0
    ) {
      alert('Fields are required!')
      toast.error('Invalid fields! Try again', {
        autoClose: 1500,
        position: 'bottom-right',
      })
      return
    }

    // dispatch(register(newUser)).then((response) => {
    //   let statusCode = response.payload.statusCode
    //   if (statusCode === 201) {
    //     navigate('/login')
    //   }
    // })
  }

  return (
    <section className="register-container">
      <form onSubmit={registerUser}>
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
          {/* Show all appropriate roles for user registering*/}
        </div>

        <button type="submit">Register</button>
      </form>
    </section>
  )
}
