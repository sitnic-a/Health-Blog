import { useDispatch, useSelector } from 'react-redux'
import {
  getDbUsers,
  setSelectedUser,
} from '../../../../redux-toolkit/features/adminSlice'
import { openDeleteModal } from '../../../../redux-toolkit/features/modalSlice'
import { CiTrash } from 'react-icons/ci'
import { getDbRoles } from '../../../../redux-toolkit/features/userSlice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import ManageUsersTableCSS from './ManageUsersTable.css'

export const ManageUsersTable = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { dbUsers, selectedRole, isFailed } = useSelector((store) => store.admin)

  useEffect(() => {
    let objectWithData = {
      query: {},
      authenticatedUser,
    }
    dispatch(getDbRoles())
    dispatch(getDbUsers(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error('Check your search parameters!', {
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Users are not fetched properly!', {
            position: 'bottom-right',
          })
          return
        }

        if (
          data?.payload?.statusCode === 200 &&
          data?.payload?.serviceResponseObject.length <= 0
        ) {
          toast.warning('There are currenly no users that uses this system!', {
            position: 'bottom-right',
          })
          return
        }

        if (data?.payload?.statusCode === 200) {
          toast.success('Successfully retrieved users!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }
      }
    })
  }, [])

  return (
    !isFailed &&
    dbUsers?.length > 0 && (
      <div className="manage-users-users-list-main-container">
        <table className="manage-users-table">
          <thead>
            <tr className="manage-users-table-row">
              <th className="manage-users-table-row-head-cell">Username</th>
              {selectedRole === 4 && (
                <>
                  <th className="manage-users-table-row-head-cell manage-users-more-cell-name">
                    Name
                  </th>
                  <th className="manage-users-table-row-head-cell manage-users-more-cell-organization">
                    Organization
                  </th>
                  <th className="manage-users-table-row-head-cell manage-users-more-cell-phone-number">
                    Phone number
                  </th>
                  <th className="manage-users-table-row-head-cell manage-users-more-cell-email">
                    Email
                  </th>
                </>
              )}
              <th className="manage-users-table-row-head-cell">Roles</th>
              <th className="manage-users-table-row-head-cell">Action</th>
            </tr>
          </thead>
          <tbody className="manage-users-table-body">
            {dbUsers?.map((user) => {
              let person = `${user?.firstName} ${user?.lastName}`
              return (
                <tr className="manage-users-table-body-row" key={user.id}>
                  <td className="manage-users-table-data-cell manage-users-data-username">
                    {user?.username}
                  </td>
                  {selectedRole === 4 && (
                    <>
                      <td className="manage-users-table-data-cell manage-users-data-name">
                        {person}
                      </td>
                      <td className="manage-users-table-data-cell manage-users-data-organization">
                        {user?.organization}
                      </td>
                      <td className="manage-users-table-data-cell manage-users-data-phone-number">
                        {user?.phoneNumber}
                      </td>
                      <td className="manage-users-table-data-cell manage-users-data-email">
                        {user?.email}
                      </td>
                    </>
                  )}
                  <td className="manage-users-table-data-cell">
                    {user?.roles &&
                      user?.roles.map((role) => {
                        return (
                          <span
                            className="manage-users-table-data-cell manage-users-data-role"
                            key={role?.id}
                          >
                            {role?.name}
                          </span>
                        )
                      })}
                  </td>
                  <td className="manage-users-table-data-cell">
                    <span
                      onClick={() => {
                        dispatch(setSelectedUser(user))
                        dispatch(openDeleteModal(true))
                      }}
                    >
                      <CiTrash className="manage-users-remove-user-button" />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  )
}
