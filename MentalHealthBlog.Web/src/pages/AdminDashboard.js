import { Link } from 'react-router-dom'
import { FaUserCheck, FaUser } from 'react-icons/fa'

export const AdminDashboard = () => {
  return (
    <section id="admin-dashboard-main-container">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-actions-container">
          <Link
            className="admin-dashboard-link-request admin-link-mental-health-experts-requests"
            to={'requests'}
          >
            <div className="admin-dashboard-request-container">
              <FaUserCheck />
              Requests
            </div>
          </Link>

          <Link
            className="admin-dashboard-link-request admin-link-manage-users"
            to={'manage-users'}
          >
            <div className="admin-dashboard-request-container">
              <FaUser />
              Users
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
