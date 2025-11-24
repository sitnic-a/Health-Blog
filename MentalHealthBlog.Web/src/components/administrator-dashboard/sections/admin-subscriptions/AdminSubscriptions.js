import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { getDbRoles } from '../../../../redux-toolkit/features/userSlice'
import { db_roles } from '../../../../enums/roles'
import { Navbar } from '../../../shared/Navbar/Navbar'

import { LiaSearchSolid } from 'react-icons/lia'

import AdminSubscriptionsCSS from './AdminSubscriptions.css'

export const AdminSubscriptions = () => {
  let dispatch = useDispatch()
  let [userTypes, setUserTypes] = useState([])
  let [months, setMonths] = useState([])

  useEffect(() => {
    moment.locale('bs')
    let bsMonthsWithFirstUppercaseLetter = moment.months().map((month) => {
      return month.charAt(0).toUpperCase() + month.slice(1)
    })
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
          <h2>Filtrirajte uplate:</h2>
          <div className="admin-subscriptions-header-filter-container">
            <div className="admin-subscriptions-header-filter-row">
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-label">
                  Godina:{' '}
                </p>
                <input type="text" placeholder="Unesite godinu..." />
              </div>
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-label">
                  Mjesec:{' '}
                </p>
                <select>
                  {months.map((month, index) => {
                    return (
                      <option key={index + 1} value={index + 1}>
                        {month}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="admin-subscriptions-header-filter-col">
                <p className="admin-subscriptions-header-filter-condition-label">
                  Tip korisnika:{' '}
                </p>
                <select>
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
                <p>Ime/prezime/username: </p>
                <input
                  type="text"
                  placeholder="Unesite ime, prezime ili username"
                />
              </div>

              <div className="admin-subscriptions-header-filter-col">
                <button>
                  Tražite <LiaSearchSolid />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
