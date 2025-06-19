import { useEffect } from 'react'
import Modal from 'react-modal'
import { getDbRoles } from '../../../redux-toolkit/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
  getDbUsers,
  removeUserById,
  setSelectedUser,
} from '../../../redux-toolkit/features/adminSlice'
import { setSelectedRole } from '../../../redux-toolkit/features/adminSlice'

import { FaTrash } from 'react-icons/fa'
import { BiError } from 'react-icons/bi'
import { openDeleteModal } from '../../../redux-toolkit/features/modalSlice'
import { application } from '../../../../application'
import { toast } from 'react-toastify'

export const ManageUsers = () => {
  let dispatch = useDispatch()
  let { dbRoles, authenticatedUser } = useSelector((store) => store.user)
  let { dbUsers, dbUser, selectedRole, isFailed } = useSelector(
    (store) => store.admin
  )
  let { isDeleteOpen } = useSelector((store) => store.modal)

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
    <div className="main-manage-users-container">
      <Modal
        isOpen={isDeleteOpen}
        style={application.modal_style}
        appElement={document.querySelector('.main-manage-users-container')}
        onRequestClose={() => {
          dispatch(openDeleteModal(false))
        }}
      >
        <div className="manage-users-modal-content">
          <div className="manage-users-modal-title">
            <h2>Are you sure you want to delete this user?</h2>
          </div>
          <div className="manage-users-modal-actions">
            <button
              type="button"
              className="manage-users-modal-confirm-delete-button"
              onClick={() => {
                let objectWithData = {
                  dbUser,
                  authenticatedUser,
                }
                if (
                  dbUser?.roles?.some(
                    (ur) => ur?.name === 'Psychologist / Psychotherapist'
                  )
                ) {
                  dispatch(removeUserById(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.StatusCode
                    if (statusCode !== 200) {
                      if (statusCode === 400) {
                        toast.error("User don't exist! Check parameters!", {
                          position: 'bottom-right',
                        })
                        return
                      }
                      if (statusCode === 404) {
                        toast.error('User not deleted! Not found!', {
                          position: 'bottom-right',
                        })
                        return
                      }
                    }
                  })
                  dispatch(openDeleteModal(false))
                  return
                }
                dispatch(removeUserById(objectWithData)).then((data) => {
                  let statusCode = data?.payload?.StatusCode
                  if (statusCode !== 200) {
                    if (statusCode === 400) {
                      toast.error("User don't exist! Check parameters!", {
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('User not deleted! Not found!', {
                        position: 'bottom-right',
                      })
                      return
                    }
                  }
                })
                dispatch(openDeleteModal(false))
              }}
            >
              DELETE
            </button>
            <button
              type="button"
              className="manage-users-modal-abort-delete-button"
              onClick={() => dispatch(openDeleteModal(false))}
            >
              LEAVE
            </button>
          </div>
        </div>
      </Modal>
      <div className="manage-users-header">
        <h2>Manage users</h2>
        <h3>Filter</h3>
      </div>
      <div className="manage-users-filter-container">
        <div className="manage-users-filter select-role-filter-main-container">
          {dbRoles?.length > 0 && (
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

                  let objectWithData = {
                    query: {
                      role: parseInt(selectedRoleId),
                      searchCondition,
                    },
                    authenticatedUser,
                  }
                  dispatch(getDbUsers(objectWithData)).then((data) => {
                    let statusCode = data?.payload?.StatusCode
                    if (statusCode !== 200) {
                      if (statusCode === 400) {
                        toast.error("Couldn't fetch users!", {
                          position: 'bottom-right',
                        })
                        return
                      }
                      if (statusCode === 404) {
                        toast.error('Users not fetched properly!', {
                          position: 'bottom-right',
                        })
                        return
                      }

                      if (
                        data?.payload?.statusCode === 200 &&
                        data?.payload?.serviceResponseObject.length === 0
                      ) {
                        toast.warning('No users registered!', {
                          position: 'bottom-right',
                        })
                        return
                      }

                      if (data?.payload?.statusCode === 200) {
                        toast.success('Successfully filtered users!', {
                          autoClose: 1500,
                          position: 'bottom-right',
                        })
                      }
                    }
                  })
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
                {dbRoles?.map((role) => {
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
                let objectWithData = {
                  query: {
                    role: parseInt(selectedRoleId),
                    searchCondition,
                  },
                  authenticatedUser,
                }
                dispatch(getDbUsers(objectWithData)).then((data) => {
                  let statusCode = data?.payload?.StatusCode
                  if (statusCode !== 200) {
                    if (statusCode === 400) {
                      toast.error("Couldn't fetch experts!", {
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('Experts not fetched properly!', {
                        position: 'bottom-right',
                      })
                      return
                    }

                    if (
                      data?.payload?.statusCode === 200 &&
                      data?.payload?.serviceResponseObject.length === 0
                    ) {
                      toast.warning('No such expert registered!', {
                        position: 'bottom-right',
                      })
                      return
                    }

                    if (data?.payload?.statusCode === 200) {
                      toast.success('Successfully filtered experts!', {
                        autoClose: 1500,
                        position: 'bottom-right',
                      })
                    }
                  }
                })
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

              let objectWithData = {
                query: {
                  role: parseInt(selectedRoleId),
                  searchCondition,
                },
                authenticatedUser,
              }
              dispatch(getDbUsers(objectWithData)).then((data) => {
                let statusCode = data?.payload?.StatusCode
                if (statusCode !== 200) {
                  if (statusCode === 400) {
                    toast.error("Couldn't fetch experts!", {
                      position: 'bottom-right',
                    })
                    return
                  }
                  if (statusCode === 404) {
                    toast.error('Experts not fetched properly!', {
                      position: 'bottom-right',
                    })
                    return
                  }

                  if (
                    data?.payload?.statusCode === 200 &&
                    data?.payload?.serviceResponseObject.length === 0
                  ) {
                    toast.warning('No such expert registered!', {
                      position: 'bottom-right',
                    })
                    return
                  }

                  if (data?.payload?.statusCode === 200) {
                    toast.success('Successfully filtered experts!', {
                      autoClose: 1500,
                      position: 'bottom-right',
                    })
                  }
                }
              })
            }}
          >
            Search
          </button>
        </div>
      </div>

      {isFailed && (
        <div className="manage-users-error-container">
          <BiError className="manage-users-error-no-data-icon" />
          <div className="manage-users-error-information">
            <p>
              Users not fetched properly! If this continues contact support!
            </p>
          </div>
        </div>
      )}

      {!isFailed && dbUsers?.length === 0 && (
        <div className="manage-users-users-list-main-container">
          <p>When someone register you'll see it first! ;)</p>
        </div>
      )}

      {!isFailed && dbUsers?.length > 0 && (
        <div className="manage-users-users-list-main-container">
          <div className="manage-users-users-list-main-container-header">
            <h4>Users of application:</h4>
          </div>

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
                      <span
                        onClick={() => {
                          dispatch(setSelectedUser(user))
                          dispatch(openDeleteModal(true))
                        }}
                      >
                        <FaTrash className="manage-users-remove-user-button" />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
