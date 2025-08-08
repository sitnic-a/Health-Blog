import { useDispatch, useSelector } from 'react-redux'
import {
  getDbUsers,
  setSelectedRole,
} from '../../../../../redux-toolkit/features/adminSlice'

import { toast } from 'react-toastify'

import ManageUsersFilterCSS from './ManageUsersFilter.css'

export const ManageUsersFilter = () => {
  let dispatch = useDispatch()
  let { dbRoles, authenticatedUser } = useSelector((store) => store.user)

  return (
    <div className="manage-users-filter-container">
      <div className="manage-users-filter select-role-filter-main-container">
        {dbRoles?.length > 0 && (
          <div className="manage-users-select-filter">
            <span className="manage-users-select-filter-title">Role:</span>
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
        <span className="manage-users-filter-condition-title">
          Name/surname/organization:{' '}
        </span>
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
  )
}
