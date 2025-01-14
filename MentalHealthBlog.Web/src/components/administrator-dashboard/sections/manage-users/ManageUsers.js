import { useEffect } from 'react'
import { getDbRoles } from '../../../redux-toolkit/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export const ManageUsers = () => {
  let dispatch = useDispatch()
  let { dbRoles } = useSelector((store) => store.user)

  useEffect(() => {
    dispatch(getDbRoles())
  }, [])

  return (
    <div className="main-manage-users-container">
      <div className="manage-users-header">
        <h2>Manage users</h2>
        <h3>Filter</h3>
      </div>
      <div className="manage-users-filter-container">
        <div className="manage-users-filter select-role-filter-main-container">
          {dbRoles.length > 0 && (
            <div className="manage-users-select-filter">
              <span>Role:</span>
              <select
                className="manage-users-select-role-filter"
                name="manage-users-role"
                id=""
              >
                {dbRoles.map((role) => {
                  return (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  )
                })}
              </select>
            </div>
          )}
        </div>
        <div className="manage-users-filter input-filter-main-container">
          <span>Name/surname/organization: </span>
          <input
            name="manage-users-name-input-filter"
            className="manage-users-name-input-filter"
            type="text"
            placeholder="Enter search condition"
          />
        </div>
      </div>

      <div className="manage-users-users-list-main-container"></div>
    </div>
  )
}
