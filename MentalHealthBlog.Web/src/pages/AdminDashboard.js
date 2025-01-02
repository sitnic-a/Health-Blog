import { Link } from 'react-router-dom'

export const AdminDashboard = () => {
  return (
    <section id="admin-dashboard-main-container">
      <div className="admin-dashboard-container">
        <div className="actions-container-admin-dashboard">
          <Link to={'requests'}>
            <div className="request-mental-health-experts">Requests</div>
          </Link>
        </div>
      </div>
    </section>
  )
}
