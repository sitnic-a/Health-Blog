import { useDispatch, useSelector } from 'react-redux'
import { createAssignment } from '../../redux-toolkit/features/mentalExpertSlice'

export const CreateAssignment = () => {
  let dispatch = useDispatch()
  let { authenticatedUser, dbUser } = useSelector((store) => store.user)

  let giveAssignment = (e) => {
    console.log('Auth user ', authenticatedUser)

    e.preventDefault()
    let form = new FormData(e.target)
    let data = Object.fromEntries([...form.entries()])
    let addAssignmentObj = {
      assignmentGivenToId: dbUser.id,
      assignmentGivenById: authenticatedUser.id,
      content: data['create-assignment-content'],
      createdAt: new Date(),
    }
    dispatch(createAssignment(addAssignmentObj))
  }

  return (
    <div id="create-assignment-main-container">
      <div className="create-assignment-header">
        <h1 className="create-assignment-main-title">Give new assignment</h1>
        <p className="create-assignment-description">
          This is the place for doctor to give an assignment to user. It's
          provided as additional way to help user during the therapy.
        </p>
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
            </label>
            <p className="create-assignment-user-to-accomplish-task">
              {dbUser !== null ? dbUser.username : 'Unknown'}
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
  )
}
