import { useSelector } from 'react-redux'

export const CreateAssignment = () => {
  let { dbUser } = useSelector((store) => store.user)

  return (
    <div id="create-assignment-main-container">
      <div className="create-assignment-header">
        <h1 className="create-assignment-main-title">Give new assignment</h1>
        <p className="create-assignment-description">
          This is the place for doctor to give an assignment to user. It's
          provided as additional way to help user during the therapy.
        </p>
      </div>
      <form id="create-assignment-form">
        <div className="create-assignment-assignment-container">
          <div className="create-assignment-assignment-task">
            <label
              className="create-assignment-label"
              htmlFor="create-assignment-task"
            >
              Assignment:
            </label>
            <br />
            <textarea
              className="create-assignment-task-textarea"
              rows={15}
              name="create-assignment-task"
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
  )
}
