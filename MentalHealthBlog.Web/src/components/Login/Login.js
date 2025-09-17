import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, setIsFailed } from '../../redux-toolkit/features/userSlice'
import {
  setUsernameValidationData,
  setPasswordValidationData,
} from '../../redux-toolkit/features/validationSlice'

import { toast } from 'react-toastify'
import { Loader } from '../shared/Loader/Loader'
import {
  checkPasswordValidity,
  checkUsernameValidity,
  stringIsNullOrEmpty,
} from '../../utils/helper-methods/methods'

import LoginCSS from './Login.css'

export const Login = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let { isLogging } = useSelector((store) => store.user)
  let { usernameValidationData, passwordValidationData } = useSelector(
    (store) => store.validation
  )

  let resetValidationData = () => {
    dispatch(setUsernameValidationData({}))
    dispatch(setPasswordValidationData({}))
  }

  useEffect(() => {
    resetValidationData()
  }, [])

  let loginUser = async (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let formData = form.entries()
    let data = Object.fromEntries([...formData])

    let user = {
      username: data?.username,
      password: data?.password,
    }

    let [usernameIsValid, usernameValidationMessages] = checkUsernameValidity(
      user?.username,
      []
    )
    dispatch(
      setUsernameValidationData({
        usernameIsValid,
        usernameValidationMessages,
      })
    )

    let [passwordIsValid, passwordValidationMessages] = checkPasswordValidity(
      user?.password,
      []
    )

    dispatch(
      setPasswordValidationData({
        passwordIsValid,
        passwordValidationMessages,
      })
    )

    if (
      stringIsNullOrEmpty(user?.username) ||
      !usernameIsValid ||
      stringIsNullOrEmpty(user?.password) ||
      !passwordIsValid
    ) {
      toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      dispatch(setIsFailed(true))
      return
    }

    dispatch(login(user)).then((response) => {
      let statusCode = response?.payload?.statusCode

      if (statusCode === undefined) {
        toast.error('Login nije moguć!', {
          autoClose: 3000,
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
        toast.success('Login uspješan', {
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
              <h1>Dobrodošli na Psihonet!</h1>
              <h1> Osjećajte se slobodno da izrazite sve svoje emocije!</h1>
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
                    placeholder="Unesite svoj username..."
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
                    placeholder="Unesite svoj password..."
                    onBlur={(e) => {
                      let password = e.target.value
                      let [passwordIsValid, passwordValidationMessages] =
                        checkPasswordValidity(password, [])

                      dispatch(
                        setPasswordValidationData({
                          passwordIsValid,
                          passwordValidationMessages,
                        })
                      )
                    }}
                  />

                  {!passwordValidationData?.passwordIsValid && (
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
                <section id="register-main-container">
                  <div className="register-regular-user-main-container">
                    <Link
                      className="register-link regular-user-link"
                      to={'/register'}
                      state={{ isRegularUser: true }}
                    >
                      Registruj se kao korisnik
                    </Link>
                  </div>
                  <div className="register-mental-health-expert-main-container">
                    <Link
                      className="register-link mental-health-expert-link"
                      to={'/register'}
                      state={{ isMentalHealthExpert: true }}
                    >
                      Registruj se kao stručnjak mentalnog zdravlja
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
