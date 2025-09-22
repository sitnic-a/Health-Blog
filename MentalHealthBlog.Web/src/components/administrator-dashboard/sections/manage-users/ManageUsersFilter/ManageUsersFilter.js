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
            <span className="manage-users-select-filter-title">Uloga:</span>
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
                      toast.error('Nije moguće dobaviti korisnike!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                      return
                    }
                    if (statusCode === 404) {
                      toast.error('Korisnici nisu dohvaćeni!', {
                        autoClose: 3000,
                        position: 'bottom-right',
                      })
                      return
                    }

                    if (
                      data?.payload?.statusCode === 200 &&
                      data?.payload?.serviceResponseObject?.length === 0
                    ) {
                      toast.warning('Nema registrovanih korisnika!', {
                        autoClose: 1500,
                        position: 'bottom-right',
                      })
                      return
                    }

                    if (data?.payload?.statusCode === 200) {
                      toast.success('Korisnici uspješno isfiltrirani!', {
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
              <option value={0}>Odaberite ulogu iz liste</option>
              {dbRoles?.map((role) => {
                return (
                  <option key={role?.id} value={role?.id}>
                    {role?.name}
                  </option>
                )
              })}
            </select>
          </div>
        )}
      </div>
      <div className="manage-users-filter input-filter-main-container">
        <span className="manage-users-filter-condition-title">
          Ime/prezime/organizacija:
        </span>
        <input
          name="manage-users-name-input-filter"
          className="manage-users-name-input-filter"
          type="text"
          placeholder="Unesite filter..."
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
                    toast.error('Nije moguće dobaviti stručnjake!', {
                      autoClose: 3000,
                      position: 'bottom-right',
                    })
                    return
                  }
                  if (statusCode === 404) {
                    toast.error('Stručnjaci nisu uspješno dobavljeni!', {
                      autoClose: 3000,
                      position: 'bottom-right',
                    })
                    return
                  }

                  if (
                    data?.payload?.statusCode === 200 &&
                    data?.payload?.serviceResponseObject.length === 0
                  ) {
                    toast.warning('Nijedan stručnjak ne odgovara opisu!', {
                      autoClose: 1500,
                      position: 'bottom-right',
                    })
                    return
                  }

                  if (data?.payload?.statusCode === 200) {
                    toast.success('Stručnjaci uspješno isfiltrirani!', {
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
                  toast.error('Nije moguće dobaviti stručnjake!', {
                    position: 'bottom-right',
                  })
                  return
                }
                if (statusCode === 404) {
                  toast.error('Stručnjaci nisu uspješno dobavljeni!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }

                if (
                  data?.payload?.statusCode === 200 &&
                  data?.payload?.serviceResponseObject.length === 0
                ) {
                  toast.warning('Nijedan stručnjak ne odgovara opisu!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }

                if (data?.payload?.statusCode === 200) {
                  toast.success('Stručnjaci uspješno isfiltrirani!', {
                    autoClose: 1500,
                    position: 'bottom-right',
                  })
                }
              }
            })
          }}
        >
          Traži
        </button>
      </div>
    </div>
  )
}
