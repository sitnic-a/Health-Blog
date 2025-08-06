import { useDispatch, useSelector } from 'react-redux'
import { createAssignment } from '../../redux-toolkit/features/mentalExpertSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkNewAssignmentValidity } from '../../utils/helper-methods/methods'

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
      toast.error('All form data are required!', {
        position: 'bottom-right',
      })
      return
    }

    dispatch(createAssignment(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 201) {
        if (statusCode === 400) {
          toast.error('Check out data from form!', {
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error("Assignment couldn't be created!", {
            position: 'bottom-right',
          })
          return
        }
      }

      if (data?.payload?.statusCode === 201) {
        toast.success(`Assignment succesfully given to ${dbUser.username}`, {
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
            <h1 className="create-assignment-main-title">
              Give new assignment
            </h1>
            <p className="create-assignment-description">
              This is the place for doctor to give an assignment to user. It's
              provided as additional way to help user during the therapy.
            </p>
            <p className="required-field">Required fields *</p>
          </div>
          <form id="create-assignment-form" onSubmit={giveAssignment}>
            <div className="create-assignment-assignment-container">
              <div className="create-assignment-assignment-task">
                <label
                  className="create-assignment-label"
                  htmlFor="create-assignment-content"
                >
                  Assignment:
                </label>
                <span className="required-field"> *</span>
                <br />
                <textarea
                  className="create-assignment-content-textarea"
                  rows={15}
                  name="create-assignment-content"
                  placeholder="Assignment text..."
                ></textarea>
              </div>

              <div className="create-assignment-user-to-accomplish">
                <label
                  className="create-assignment-label"
                  htmlFor="user-to-accomplish-task"
                >
                  Assignment for user:
                </label>{' '}
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
              Give assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
