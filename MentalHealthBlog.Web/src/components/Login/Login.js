import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, setIsFailed } from '../../redux-toolkit/features/userSlice'
import { toast } from 'react-toastify'
import { Loader } from '../shared/Loader/Loader'
import { stringIsNullOrEmpty } from '../../utils/helper-methods/methods'

import LoginCSS from './Login.css'

export const Login = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { isLogging } = useSelector((store) => store.user)

  let loginUser = async (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let formData = form.entries()
    let data = Object.fromEntries([...formData])

    let user = {
      username: data.username,
      password: data.password,
    }

    if (
      stringIsNullOrEmpty(user.username) ||
      stringIsNullOrEmpty(user.password)
    ) {
      toast.error('Fields are required', {
        autoClose: 1500,
        position: 'bottom-right',
      })
      dispatch(setIsFailed(true))
      return
    }

    dispatch(login(user)).then((response) => {
      let statusCode = response?.payload?.statusCode

      if (statusCode === undefined) {
        toast.error('Something went wrong', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      }

      if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
        navigate('/', {
          replace: true,
          state: {
            prevUrl: window.location.href,
          },
        })
        toast.success('Succesfully logged in', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      }
    })
    form.delete('username')
    form.delete('password')
    form.set('password', '')
  }

  return (
    <>
      {isLogging === true ? (
        <Loader />
      ) : (
        <section className="login">
          <form onSubmit={loginUser}>
            <div className="login-container">
              <h1>
                Welcome to Mental Health Blog. Feel free to write express your
                emotions!
              </h1>
              <div className="form-fields">
                <div>
                  <label className="form-field-label" htmlFor="username">
                    Username:
                  </label>
                  <span className="required-field"> *</span>
                  <br />
                  <input
                    className="form-field"
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                <br />
                <div>
                  <label className="form-field-label" htmlFor="password">
                    Password:
                  </label>
                  <span className="required-field"> *</span>

                  <br />
                  <input
                    className="form-field"
                    id="password"
                    type="password"
                    name="password"
                  />
                </div>
                <section id="register-main-container">
                  <div className="register-regular-user-main-container">
                    <Link
                      className="register-link regular-user-link"
                      to={'/register'}
                      state={{ regularUser: true }}
                    >
                      Create an account
                    </Link>
                  </div>
                  <div className="register-mental-health-expert-main-container">
                    <Link
                      className="register-link mental-health-expert-link"
                      to={'/register'}
                      state={{ isMentalHealthExpert: true }}
                    >
                      Register as mental health expert
                    </Link>
                  </div>
                </section>
                <button type="submit" id="login-container-button">
                  Login
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </>
  )
}
