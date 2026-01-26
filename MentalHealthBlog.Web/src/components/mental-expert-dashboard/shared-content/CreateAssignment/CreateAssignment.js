import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

import { createAssignment } from '../../../../redux-toolkit/features/mentalExpertSlice'
import { setContentValidationData } from '../../../../redux-toolkit/features/validationSlice'
import {
  checkInputDataValidity,
  checkNewAssignmentValidity,
  stringIsNullOrEmpty,
} from '../../../../utils/helper-methods/methods'

import CreateAssignmentCSS from './CreateAssignment.css'

export const CreateAssignment = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let mentalHealthExpertIsChoosingUserCookie = Cookies.get(
    'mentalHealthExpertIsChoosingUser',
  )

  console.log(mentalHealthExpertIsChoosingUserCookie)

  let mentalHealthExpertIsChoosingUser = !stringIsNullOrEmpty(
    mentalHealthExpertIsChoosingUserCookie,
  )

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { dbUser } = useSelector((store) => store.user)
  let { contentValidationData } = useSelector((store) => store.validation)

  useEffect(() => {
    dispatch(setContentValidationData({}))
  }, [])

  let giveAssignment = (e) => {
    e.preventDefault()
    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])
    let objectWithData = {
      addAssignmentObj: {
        assignmentGivenToId: dbUser?.id,
        assignmentGivenById: authenticatedUser?.id,
        content: data['create-assignment-content'],
        createdAt: new Date(),
      },
      authenticatedUser,
    }

    let content = objectWithData?.addAssignmentObj?.content
    let isTitle = false
    let isContent = true
    let [isValid, validationMessages] = checkInputDataValidity(
      content,
      [],
      isTitle,
      isContent,
    )

    dispatch(
      setContentValidationData({
        contentIsValid: isValid,
        contentValidationMessages: validationMessages,
      }),
    )

    if (!contentValidationData?.contentIsValid) {
      toast.error('Molimo slijedite upute prilikom popunjavanja polja!', {
        autoClose: 3000,
        position: 'bottom-right',
      })
      return
    }

    dispatch(createAssignment(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 201) {
        if (statusCode === 400) {
          toast.error('Sva polja moraju imati vrijednost', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Nije moguće dodijeliti zadatak!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
      }

      if (data?.payload?.statusCode === 201) {
        toast.success(`Zadatak uspješno dodijeljen ${dbUser.username}`, {
          autoClose: 1500,
          position: 'bottom-right',
        })
        navigate('/')
      }
    })
  }

  return (
    <div id="create-assignment-main-container">
      <div className="create-assignment-wrapper">
        <div className="create-assignment-container">
          <div className="create-assignment-header">
            <h1 className="create-assignment-main-title">Kreiraj zadatak</h1>
            <p className="create-assignment-description">
              Ovo je mjesto za stručnjake gdje mogu dodijeliti zadaću
              korisnicima na terapiji. Zamišljeno je kao dodatni način pomoći
              korisniku tokom terapijskog procesa!
            </p>
            <p className="required-field">Polja obavezna za unos *</p>
          </div>
          <form id="create-assignment-form" onSubmit={giveAssignment}>
            <div className="create-assignment-assignment-container">
              <div className="create-assignment-assignment-task">
                <label
                  className="create-assignment-label"
                  htmlFor="create-assignment-content"
                >
                  Zadatak:
                </label>
                <span className="required-field"> *</span>
                <br />
                <textarea
                  className="form-field create-assignment-content-textarea"
                  rows={12}
                  name="create-assignment-content"
                  placeholder="Unesite ovdje zadatak..."
                  spellCheck={false}
                  onBlur={(e) => {
                    let content = e.target.value
                    let isTitle = false
                    let isContent = true
                    let [isValid, validationMessages] = checkInputDataValidity(
                      content,
                      [],
                      isTitle,
                      isContent,
                    )

                    dispatch(
                      setContentValidationData({
                        contentIsValid: isValid,
                        contentValidationMessages: validationMessages,
                      }),
                    )
                  }}
                ></textarea>
              </div>

              {!contentValidationData?.contentIsValid && (
                <div className="validation-message-main-container">
                  {contentValidationData?.contentValidationMessages?.map(
                    (message, index) => {
                      return (
                        <p key={index} className="validation-message">
                          - {message}
                        </p>
                      )
                    },
                  )}
                </div>
              )}

              <div className="create-assignment-user-to-accomplish">
                {mentalHealthExpertIsChoosingUser === true ? (
                  <>
                    <p>uh</p>
                  </>
                ) : (
                  <>
                    <label
                      className="create-assignment-label"
                      htmlFor="user-to-accomplish-task"
                    >
                      Zadaću dodjeljujete:
                    </label>
                    <span className="required-field"> *</span>
                    <p className="create-assignment-user-to-accomplish-task">
                      {dbUser?.username}
                    </p>
                  </>
                )}
              </div>
            </div>
            <button
              className="create-assignment-give-assignment-button"
              type="submit"
            >
              Dodijeli zadatak
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
