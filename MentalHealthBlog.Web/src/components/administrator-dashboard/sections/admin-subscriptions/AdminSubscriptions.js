import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getDbRoles } from '../../../../redux-toolkit/features/userSlice'
import { db_roles } from '../../../../enums/roles'
import { Navbar } from '../../../shared/Navbar/Navbar'

import { LiaSearchSolid } from 'react-icons/lia'

import AdminSubscriptionsCSS from './AdminSubscriptions.css'
import { getSubscriptionUsers } from '../../../../redux-toolkit/features/subscriptionSlice'
import { stringIsNullOrEmpty } from '../../../../utils/helper-methods/methods'

export const AdminSubscriptions = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { subscriptionUsers } = useSelector((store) => store.subscription)
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

  return (
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
                  className="admin-subscriptions-header-filter-year-value"
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
                  className="admin-subscriptions-header-filter-name-surname-username-value"
                  type="text"
                  placeholder="Unesite ime, prezime ili username"
                />
              </div>

              <div className="admin-subscriptions-header-filter-col">
                <button
                  className="admin-subscriptions-header-filter-search-button"
                  onClick={() => {
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
                    console.log(
                      'SubYear ',
                      subscriptionYear,
                      ' SubMonth ',
                      subscriptionMonth,
                      ' UserId ',
                      userTypeId,
                      ' NameUser ',
                      firstNameLastNameUsername
                    )

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

        <div className="admin-subscription-subscription-table-container">
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
              {/* users list */}
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
                      <span className="admin-subscriptions-subscription-table-body-cell-remaining-days-reminder">
                        manje od 2 dana
                      </span>
                      <input
                        className="admin-subscriptions-subscription-table-body-cell-payment-value"
                        type="text"
                        placeholder="Unesite iznos uplate"
                      />
                      <button
                        className="admin-subscriptions-subscription-table-body-cell-action admin-subscription-subscription-enable"
                        type="button"
                      >
                        Uplatite
                      </button>
                      <button
                        className="admin-subscriptions-subscription-table-body-cell-action admin-subscription-subscription-disable"
                        type="button"
                      >
                        Zabrana
                      </button>
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
