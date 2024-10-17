import React from 'react'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { register } from './redux-toolkit/features/userSlice'

export const Register = () => {
  let navigate = useNavigate()
  let dispatch = useDispatch()

  let registerUser = async (e) => {
    e.preventDefault()
    console.log('Register invoked')
    let form = new FormData(e.target)
    let formData = form.entries()
    let data = Object.fromEntries([...formData])

    let newUser = {
      username: data.username,
      password: data.password,
    }

    if (
      newUser.username === '' ||
      newUser.username === null ||
      newUser.password === '' ||
      newUser.password === null
    ) {
      alert('Fields are required!')
      toast.error('Invalid fields! Try again', {
        autoClose: 1500,
        position: 'bottom-right',
      })
      return
    }

    dispatch(register(newUser)).then((response) => {
      let statusCode = response.payload.statusCode
      if (statusCode === 201) {
        navigate('/login')
      }
    })
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
          {/* Show all appropriate roles for user registering*/}
        </div>

        <button type="submit">Register</button>
      </form>
    </section>
  )
}
