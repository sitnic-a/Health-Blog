import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import * as signalR from '@microsoft/signalr'
import { getNewRegisteredExperts } from '../../redux-toolkit/features/adminSlice'
import { application } from '../../application'
import { FaUser } from 'react-icons/fa'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { toast } from 'react-toastify'

import AdminDashboardCSS from './AdminDashboard.css'

export const AdminDashboard = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { isFailed, numberOfNewlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  )

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getNewRegisteredExperts(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 404) {
          toast.error('Korisnici neuspješno povučeni s baze!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }

        if (
          data?.payload?.serviceResponseObject.length === 0 &&
          data?.payload?.statusCode === 200
        ) {
          toast.warning('Svi zahtjevi su uspješno procesirani!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }

        if (data?.payload?.statusCode === 200) {
          toast.success('Novi zahtjevi su spremni za obradu', {
            autoClose: 1500,
            position: 'bottom-right',
          })
        }
      }
    })
  }, [])

  var connection = new signalR.HubConnectionBuilder()
    .withUrl(`${application.application_url}/rt-new-request`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build()

  connection.on('GetNewRegisteredMentalHealthExperts', () => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getNewRegisteredExperts(objectWithData))
  })

  connection.start().catch((e) => {
    console.log('Fetched error ', e)
  })

  return (
    <section id="admin-dashboard-main-container">
      <Navbar />

      <div className="admin-dashboard-container">
        <div className="admin-dashboard-actions-container">
          <Link
            className="admin-dashboard-link-request admin-link-mental-health-experts-requests"
            to={'requests/new-experts'}
          >
            {numberOfNewlyRegisteredMentalHealthExperts > 0 && (
              <span className="admin-dashboard-request-container-notification">
                {numberOfNewlyRegisteredMentalHealthExperts}
              </span>
            )}

            <div className="admin-dashboard-link-container">
              <p className="admin-dashboard-request-container-title">
                Zahtjevi
              </p>
              <p className="admin-dashboard-request-container-subtitle">
                Stručnjaci za mentalno zdravlje
              </p>
              {numberOfNewlyRegisteredMentalHealthExperts > 0 && (
                <span className="admin-dashboard-request-container-info">
                  Novi zahtjevi:
                  <span className="admin-dashboard-request-container-number-of-registered">
                    {numberOfNewlyRegisteredMentalHealthExperts}
                  </span>
                </span>
              )}
            </div>
          </Link>

          <Link
            className="admin-dashboard-link-request admin-link-manage-users"
            to={'manage-users'}
          >
            <div className="admin-dashboard-link-container">
              <FaUser className="admin-link-manage-users-icon" />
              <p className="admin-link-manage-users-title">Korisnici</p>
            </div>
          </Link>
        </div>
      </div>

      {isFailed && (
        <div className="admin-dashboard-error-container">
          <p>
            Nije moguće dobaviti zahtjeve. Ukoliko se ovo nastavi dešavati,
            kontaktirajte podršku!
          </p>
        </div>
      )}
    </section>
  )
}
