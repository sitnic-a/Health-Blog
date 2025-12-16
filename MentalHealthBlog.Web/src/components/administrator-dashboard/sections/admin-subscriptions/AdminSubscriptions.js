import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment'
import { getDbRoles } from '../../../../redux-toolkit/features/userSlice'
import {
  createSubscription,
  getSubscriptionUsers,
} from '../../../../redux-toolkit/features/subscriptionSlice'
import { suspendUser } from '../../../../redux-toolkit/features/adminSlice'
import { setSubscriptionAmountValidationData } from '../../../../redux-toolkit/features/validationSlice'
import {
  checkSubscriptionAmountValidity,
  stringIsNullOrEmpty,
} from '../../../../utils/helper-methods/methods'
import { db_roles } from '../../../../enums/roles'
import { NewSubscriptionUserModal } from './NewSubscriptionUserModal/NewSubscriptionUserModal'
import { Navbar } from '../../../shared/Navbar/Navbar'
import { Loader } from '../../../shared/Loader/Loader'

import { LiaSearchSolid } from 'react-icons/lia'

import AdminSubscriptionsCSS from './AdminSubscriptions.css'

export const AdminSubscriptions = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { subscriptionUsers, isLoading } = useSelector(
    (store) => store.subscription
  )
  let { subscriptionAmountValidationData } = useSelector(
    (store) => store.validation
  )
  let [userTypes, setUserTypes] = useState([])
  let [months, setMonths] = useState([])

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getSubscriptionUsers(objectWithData))
    moment.locale('bs')
    let bsMonthsWithFirstUppercaseLetter = moment.months().map((month) => {
      return month.charAt(0).toUpperCase() + month.slice(1)
    })
    bsMonthsWithFirstUppercaseLetter.unshift('Odaberite mjesec')
    setMonths(bsMonthsWithFirstUppercaseLetter)
    dispatch(getDbRoles()).then((data) => {
      let statusCode = data?.payload?.statusCode
      if (statusCode === 200) {
        let types = data?.payload?.serviceResponseObject?.filter(
          (type) =>
            type.id !== db_roles.ADMINISTRATOR && type.id !== db_roles.PARENT
        )
        types.splice(0, 0, {
          id: 0,
          name: 'Odaberi korisnika',
        })

        setUserTypes(types)
      }
    })
  }, [])

  return isLoading === true ? (
    <Loader />
  ) : (
    <section id="admin-subscriptions-main-container">
      <Navbar />
      <div className="admin-subscriptions-container">
        <div className="admin-subscriptions-header">
          <h2 className="admin-subscriptions-header-title">
            Filtrirajte uplate:
          </h2>
          <div className="admin-subscriptions-header-filter-container">
            <div className="admin-subscriptions-header-filter-row">
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-small-device-label admin-subscriptions-header-filter-condition-label">
                  Godina:{' '}
                </p>
                <input
                  className="form-field admin-subscriptions-header-filter-year-value"
                  type="text"
                  placeholder="Unesite godinu..."
                />
              </div>
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-small-device-label admin-subscriptions-header-filter-condition-label">
                  Mjesec:{' '}
                </p>
                <select className="admin-subscriptions-filter-months-picker">
                  {months.map((month, index) => {
                    return (
                      <option
                        className="admin-subscriptions-header-filter-month-value"
                        key={index + 1}
                        value={index}
                      >
                        {month}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-small-device-label admin-subscriptions-header-filter-condition-label">
                  Tip korisnika:{' '}
                </p>
                <select className="admin-subscriptions-header-filter-user-types-picker">
                  {userTypes?.map((type) => {
                    return (
                      <option key={type?.id} value={type?.id}>
                        {type?.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="admin-subscriptions-header-filter-row">
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-small-device-label admin-subscriptions-header-filter-condition-label">
                  Ime/prezime/username:{' '}
                </p>
                <input
                  className="form-field admin-subscriptions-header-filter-name-surname-username-value"
                  type="text"
                  placeholder="Unesite ime, prezime ili username"
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      authenticatedUserLocalStorage =
                        localStorage.getItem('authenticatedUser')

                      authenticatedUser = JSON.parse(
                        authenticatedUserLocalStorage
                      )

                      let subscriptionYearValue = document.querySelector(
                        '.admin-subscriptions-header-filter-year-value'
                      ).value
                      let subscriptionYear = 0
                      let subscriptionMonth = document.querySelector(
                        '.admin-subscriptions-filter-months-picker'
                      ).value
                      let userTypeId = document.querySelector(
                        '.admin-subscriptions-header-filter-user-types-picker'
                      ).value
                      let firstNameLastNameUsername = document.querySelector(
                        '.admin-subscriptions-header-filter-name-surname-username-value'
                      ).value

                      if (!stringIsNullOrEmpty(subscriptionYearValue)) {
                        subscriptionYear = parseInt(subscriptionYearValue)
                      }

                      let query = {
                        subscriptionYear: subscriptionYear,
                        subscriptionMonth: parseInt(subscriptionMonth),
                        userTypeId: parseInt(userTypeId),
                        firstNameLastNameUsername: firstNameLastNameUsername,
                      }

                      let objectWithData = {
                        query,
                        authenticatedUser,
                      }
                      dispatch(getSubscriptionUsers(objectWithData))
                      dispatch(getSubscriptionUsers())
                    }
                  }}
                />
              </div>

              <div className="admin-subscriptions-header-filter-col">
                <button
                  className="admin-subscriptions-header-filter-search-button"
                  onClick={() => {
                    authenticatedUserLocalStorage =
                      localStorage.getItem('authenticatedUser')

                    authenticatedUser = JSON.parse(
                      authenticatedUserLocalStorage
                    )
                    let subscriptionYearValue = document.querySelector(
                      '.admin-subscriptions-header-filter-year-value'
                    ).value
                    let subscriptionYear = 0
                    let subscriptionMonth = document.querySelector(
                      '.admin-subscriptions-filter-months-picker'
                    ).value
                    let userTypeId = document.querySelector(
                      '.admin-subscriptions-header-filter-user-types-picker'
                    ).value
                    let firstNameLastNameUsername = document.querySelector(
                      '.admin-subscriptions-header-filter-name-surname-username-value'
                    ).value

                    if (!stringIsNullOrEmpty(subscriptionYearValue)) {
                      subscriptionYear = parseInt(subscriptionYearValue)
                    }

                    let query = {
                      subscriptionYear: subscriptionYear,
                      subscriptionMonth: parseInt(subscriptionMonth),
                      userTypeId: parseInt(userTypeId),
                      firstNameLastNameUsername: firstNameLastNameUsername,
                    }
                    let objectWithData = {
                      query,
                      authenticatedUser,
                    }
                    dispatch(getSubscriptionUsers(objectWithData))
                  }}
                >
                  Tražite{' '}
                  <LiaSearchSolid className="admin-subscriptions-header-filter-search-button-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-subscriptions-create-new-subscribed-user-main-container">
          <button className="admin-subscriptions-create-new-subscribed-user-create-button">
            Nova pretplata
          </button>

          <NewSubscriptionUserModal />
        </div>

        <div className="admin-subscriptions-subscription-table-container">
          <table className="admin-subscriptions-subscription-table">
            <thead className="admin-subscriptions-subscription-table-header">
              <tr>
                <td className="admin-subscriptions-subscription-table-header-cell">
                  Ime
                </td>
                <td className="admin-subscriptions-subscription-table-header-cell">
                  Prezime
                </td>
                <td className="admin-subscriptions-subscription-table-header-cell">
                  Username
                </td>
                <td className="admin-subscriptions-subscription-table-header-cell">
                  Akcija
                </td>
              </tr>
            </thead>

            <tbody className="admin-subscriptions-subscription-table-body">
              {subscriptionUsers?.map((subscriptionUser, index) => {
                return (
                  <tr
                    key={index + 1}
                    className="admin-subscriptions-subscription-table-body-row"
                  >
                    <td className="admin-subscriptions-subscription-table-body-cell">
                      {subscriptionUser?.firstName}
                    </td>
                    <td className="admin-subscriptions-subscription-table-body-cell">
                      {subscriptionUser?.lastName}
                    </td>
                    <td className="admin-subscriptions-subscription-table-body-cell">
                      {subscriptionUser?.username}
                    </td>
                    <td className="admin-subscriptions-subscription-table-body-cell">
                      {subscriptionUser?.expiringSoon && (
                        <span className="admin-subscriptions-subscription-table-body-cell-remaining-days-reminder">
                          manje od 2 dana
                        </span>
                      )}

                      {!subscriptionUser?.expiringSoon || (
                        <>
                          <input
                            className="form-field admin-subscriptions-subscription-table-body-cell-payment-value"
                            type="text"
                            placeholder="Unesite iznos uplate"
                            onChange={(e) => {
                              let paidAmount = e.target.value
                              let [isValid, validationMessages] =
                                checkSubscriptionAmountValidity(paidAmount, [])

                              dispatch(
                                setSubscriptionAmountValidationData({
                                  subscriptionAmountIsValid: isValid,
                                  subscriptionAmountValidationMessages:
                                    validationMessages,
                                })
                              )

                              let validationContainer =
                                e.currentTarget.parentNode.querySelector(
                                  '.validation-message-main-container'
                                )

                              if (!isValid) {
                                validationContainer.style.display = 'initial'
                              } else {
                                validationContainer.style.display = 'none'
                              }
                            }}
                          />

                          <div className="validation-message-main-container">
                            {subscriptionAmountValidationData?.subscriptionAmountValidationMessages?.map(
                              (message, index) => {
                                return (
                                  <p key={index} className="validation-message">
                                    - {message}
                                  </p>
                                )
                              }
                            )}
                          </div>

                          <button
                            className="admin-subscriptions-subscription-table-body-cell-action admin-subscription-subscription-record-payment-button"
                            type="button"
                            onClick={(e) => {
                              let currentBodyCell = e.currentTarget.parentNode
                              authenticatedUserLocalStorage =
                                localStorage.getItem('authenticatedUser')
                              authenticatedUser = JSON.parse(
                                authenticatedUserLocalStorage
                              )

                              let paidAmount = currentBodyCell.querySelector(
                                '.admin-subscriptions-subscription-table-body-cell-payment-value'
                              ).value

                              let [isValid, validationMessages] =
                                checkSubscriptionAmountValidity(paidAmount, [])

                              dispatch(
                                setSubscriptionAmountValidationData({
                                  subscriptionAmountIsValid: isValid,
                                  subscriptionAmountValidationMessages:
                                    validationMessages,
                                })
                              )

                              if (!isValid) {
                                toast.error(
                                  'Molimo Vas slijedi upute za popunjavanje polja',
                                  {
                                    autoClose: 3000,
                                    position: 'bottom-right',
                                  }
                                )
                                return
                              }

                              let requestObj = {
                                userId: subscriptionUser?.userId,
                                paidAmount: parseFloat(paidAmount),
                                isCreatingAnAccount: false,
                              }
                              let objectWithData = {
                                requestObj,
                                authenticatedUser,
                              }
                              dispatch(createSubscription(objectWithData)).then(
                                (data) => {
                                  let statusCode = data?.payload?.statusCode
                                  let StatusCode = data?.payload?.StatusCode

                                  if (statusCode !== 200) {
                                    if (StatusCode === 400) {
                                      toast.error(
                                        'Unešeni iznos nije dovoljan!',
                                        {
                                          autoClose: 3000,
                                          position: 'bottom-right',
                                        }
                                      )
                                      return
                                    }
                                  }

                                  if (statusCode === 201) {
                                    if (
                                      !stringIsNullOrEmpty(
                                        requestObj?.paidAmount
                                      ) &&
                                      requestObj?.paidAmount > 0
                                    ) {
                                      paidAmount = ''
                                      toast.success(
                                        `Uplata za ${subscriptionUser?.firstName} ${subscriptionUser?.lastName} u iznosu od ${requestObj?.paidAmount}KM uspješno unešena!`,
                                        {
                                          autoClose: 5000,
                                          position: 'bottom-right',
                                        }
                                      )
                                    } else {
                                      toast.success(
                                        `Uplata za ${subscriptionUser?.firstName} ${subscriptionUser?.lastName} uspješno unešena!`,
                                        {
                                          autoClose: 5000,
                                          position: 'bottom-right',
                                        }
                                      )
                                    }
                                  }

                                  dispatch(getSubscriptionUsers(objectWithData))
                                }
                              )
                            }}
                          >
                            Uplatite
                          </button>
                        </>
                      )}

                      {!subscriptionUser?.isSuspended && (
                        <button
                          className="admin-subscriptions-subscription-table-body-cell-action admin-subscription-subscription-disable"
                          type="button"
                          onClick={() => {
                            authenticatedUserLocalStorage =
                              localStorage.getItem('authenticatedUser')
                            authenticatedUser = JSON.parse(
                              authenticatedUserLocalStorage
                            )

                            let requestObj = {
                              userId: subscriptionUser?.userId,
                            }

                            let objectWithData = {
                              requestObj,
                              authenticatedUser,
                            }
                            dispatch(suspendUser(objectWithData)).then(
                              (data) => {
                                let statusCode = data?.payload?.statusCode
                                if (statusCode === 200) {
                                  authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage
                                  )

                                  let objectWithData = {
                                    authenticatedUser,
                                  }
                                  dispatch(getSubscriptionUsers(objectWithData))
                                }
                              }
                            )
                          }}
                        >
                          Zabrani
                        </button>
                      )}

                      {subscriptionUser?.isSuspended && (
                        <button
                          className="admin-subscriptions-subscription-table-body-cell-action admin-subscription-subscription-enable"
                          type="button"
                          onClick={() => {
                            authenticatedUserLocalStorage =
                              localStorage.getItem('authenticatedUser')
                            authenticatedUser = JSON.parse(
                              authenticatedUserLocalStorage
                            )

                            let requestObj = {
                              userId: subscriptionUser?.userId,
                              isEnablingUsage: true,
                            }

                            let objectWithData = {
                              requestObj,
                              authenticatedUser,
                            }
                            dispatch(suspendUser(objectWithData)).then(
                              (data) => {
                                let statusCode = data?.payload?.statusCode
                                if (statusCode === 200) {
                                  authenticatedUserLocalStorage =
                                    localStorage.getItem('authenticatedUser')
                                  authenticatedUser = JSON.parse(
                                    authenticatedUserLocalStorage
                                  )

                                  let objectWithData = {
                                    authenticatedUser,
                                  }
                                  dispatch(getSubscriptionUsers(objectWithData))
                                }
                              }
                            )
                          }}
                        >
                          Dozvoli
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
