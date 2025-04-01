export const CreateAssignment = () => {
  return (
    <div id="create-assignment-main-container">
      <div className="create-assignment-header">
        <h1>Give new assignment</h1>
      </div>
      <form action="">
        <div className="create-assignment-assignment-container">
          <div className="create-assignment-assignment-task">
            <label htmlFor="create-assignment-task">Assignment</label>
            <br />
            <textarea
              rows={15}
              name="create-assignment-task"
              placeholder="assignment text..."
            ></textarea>
          </div>

          <div className="create-assignment-user-to-accomplish">
            <label htmlFor="user-to-accomplish-task">
              Assignment for user:
            </label>
            <p className="create-assignment-user-to-accomplish-task">User</p>
          </div>
        </div>
        <button type="submit">Give assignment</button>
      </form>
    </div>
  );
};
