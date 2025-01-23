import { useEffect, useState } from 'react'
import { getDbRoles } from '../../../redux-toolkit/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getDbUsers } from '../../../redux-toolkit/features/adminSlice'
import { setSelectedRole } from '../../../redux-toolkit/features/adminSlice'

import { FaTrash } from 'react-icons/fa'

export const ManageUsers = () => {
  let dispatch = useDispatch()
  let { dbRoles } = useSelector((store) => store.user)
  let { dbUsers, selectedRole } = useSelector((store) => store.admin)

  useEffect(() => {
    dispatch(getDbRoles())
    dispatch(getDbUsers({}))
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
                id="manage-users-select-role-filter"
                onChange={(e) => {
                  let selectedRoleId = document.getElementById(
                    'manage-users-select-role-filter'
                  ).value
                  let searchCondition = document.querySelector(
                    "input[name='manage-users-name-input-filter'"
                  ).value

                  var query = {
                    role: parseInt(selectedRoleId),
                    searchCondition,
                  }
                  dispatch(getDbUsers(query))
                  let __MENTAL_HEALTH_EXPERT_ROLE__ = 4
                  let inputFilterMainContainer = document.querySelector(
                    '.input-filter-main-container'
                  )

                  dispatch(setSelectedRole())
                  if (
                    parseInt(e.target.value) === __MENTAL_HEALTH_EXPERT_ROLE__
                  ) {
                    inputFilterMainContainer.style.display = 'block'

                    return
                  }
                  inputFilterMainContainer.style.display = 'none'
                }}
              >
                <option value={0}>Choose option</option>
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
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                let selectedRoleId = document.getElementById(
                  'manage-users-select-role-filter'
                ).value
                let searchCondition = document.querySelector(
                  "input[name='manage-users-name-input-filter'"
                ).value
                var query = {
                  role: parseInt(selectedRoleId),
                  searchCondition,
                }
                dispatch(getDbUsers(query))
              }
            }}
          />
        </div>
        <div className="manage-users-action filter-action">
          <button
            className="manage-users-search-filter-button"
            type="button"
            onClick={() => {
              let selectedRoleId = document.getElementById(
                'manage-users-select-role-filter'
              ).value
              let searchCondition = document.querySelector(
                "input[name='manage-users-name-input-filter'"
              ).value

              var query = {
                role: parseInt(selectedRoleId),
                searchCondition,
              }
              dispatch(getDbUsers(query))
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="manage-users-users-list-main-container">
        <div className="manage-users-users-list-main-container-header">
          <h4>Users of application:</h4>
        </div>
        {dbUsers.length > 0 && (
          <table className="manage-users-table">
            <thead>
              <tr className="manage-users-table-row">
                <th>Username</th>
                {selectedRole === 4 && (
                  <>
                    <th className="manage-users-more-cell">Name</th>
                    <th className="manage-users-more-cell">Organization</th>
                    <th className="manage-users-more-cell">Phone number</th>
                    <th className="manage-users-more-cell">Email</th>
                  </>
                )}
                <th>Roles</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dbUsers.map((user) => {
                let person = `${user.firstName} ${user.lastName}`
                return (
                  <tr className="manage-users-table-body-row" key={user.id}>
                    <td className="manage-users-table-data-cell manage-users-data-username">
                      {user.username}
                    </td>
                    {selectedRole === 4 && (
                      <>
                        <td className="manage-users-table-data-cell manage-users-data-name">
                          {person}
                        </td>
                        <td className="manage-users-table-data-cell manage-users-data-organization">
                          {user.organization}
                        </td>
                        <td className="manage-users-table-data-cell manage-users-data-phone-number">
                          {user.phoneNumber}
                        </td>
                        <td className="manage-users-table-data-cell manage-users-data-email">
                          {user.email}
                        </td>
                      </>
                    )}
                    <td>
                      {user.roles &&
                        user.roles.map((role) => {
                          return (
                            <span
                              className="manage-users-table-data-cell manage-users-data-role"
                              key={role.id}
                            >
                              {role.name}
                            </span>
                          )
                        })}
                    </td>
                    <td>
                      <span>
                        <FaTrash className="manage-users-remove-user-button" />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
