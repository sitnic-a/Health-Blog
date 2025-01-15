import { useEffect, useState } from 'react'
import { getDbRoles } from '../../../redux-toolkit/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getDbUsers } from '../../../redux-toolkit/features/adminSlice'

export const ManageUsers = () => {
  let dispatch = useDispatch()
  let { dbRoles } = useSelector((store) => store.user)
  let { dbUsers } = useSelector((store) => store.admin)

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
                onChange={(e) => {
                  let selectedRoleId = e.target.value
                  console.log('SELECT VALUE ', selectedRoleId)

                  let searchCondition = document.querySelector(
                    "input[name='manage-users-name-input-filter'"
                  ).value
                  console.log('SEARCH CONDITION ', searchCondition)

                  let role = selectedRoleId > 0 ? selectedRoleId : 0
                  console.log('ROLE VALUE ', searchCondition)

                  let query = {
                    role: parseInt(role),
                    searchCondition,
                  }

                  if (query.role <= 0 && query.searchCondition === '') {
                    query = null
                  }

                  console.log('QUERYYYYYYYYYYY ', query)
                  dispatch(getDbUsers(query))
                  console.log('Users ', dbUsers)
                }}
                className="manage-users-select-role-filter"
                name="manage-users-role"
                id="manage-users-select-role-filter"
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
            onChange={(e) => {
              let selectedRoleId = document.getElementById(
                'manage-users-select-role-filter'
              ).value
              console.log('SELECT VALUE ', selectedRoleId)

              let searchCondition = e.target.value
              console.log('SEARCH CONDITION ', searchCondition)

              let role = selectedRoleId > 0 ? selectedRoleId : 0
              console.log('ROLE VALUE ', searchCondition)

              let query = {
                role: parseInt(role),
                searchCondition,
              }

              if (query.role <= 0 && query.searchCondition === '') {
                query = null
              }
              console.log('QUERYYYYYYYYYYY ', query)

              dispatch(getDbUsers(query))
              console.log('Users ', dbUsers)
            }}
          />
        </div>
      </div>

      <div className="manage-users-users-list-main-container"></div>
    </div>
  )
}
