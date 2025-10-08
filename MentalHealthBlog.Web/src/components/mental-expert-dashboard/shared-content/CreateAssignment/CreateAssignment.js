import { useDispatch, useSelector } from 'react-redux'
import { createAssignment } from '../../../../redux-toolkit/features/mentalExpertSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkNewAssignmentValidity } from '../../../../utils/helper-methods/methods'

import CreateAssignmentCSS from './CreateAssignment.css'

export const CreateAssignment = () => {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  let { authenticatedUser, dbUser } = useSelector((store) => store.user)

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

    if (!checkNewAssignmentValidity(objectWithData?.addAssignmentObj)) {
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
          toast.error('Molimo pregledajte Vaš unos!', {
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
                ></textarea>
              </div>

              <div className="create-assignment-user-to-accomplish">
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
