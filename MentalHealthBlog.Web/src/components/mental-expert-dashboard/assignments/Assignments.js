import { useParams } from 'react-router-dom'
import { Navbar } from '../../shared/Navbar/Navbar'

import AssignmentsCSS from './Assignments.css'

export const Assignments = () => {
  let { id } = useParams()

  return (
    <section id="mental-health-experts-assignments-for-users-main-container">
      <Navbar />
      <div className="mental-health-experts-assignments-for-users-header">
        <h3 className="mental-health-experts-assignments-for-users-header-title">
          Zadaci za korisnika user
        </h3>
      </div>
      <div className="mental-health-experts-assignments-for-users-container">
        <div className="mental-health-experts-assignments-users-main-container">
          <p className="mental-health-experts-assignments-users-main-container-title">
            Korisnici sa zadacima
          </p>
        </div>
        <div className="mental-health-experts-assignments-for-users-list-of-assignements-main-container">
          <div className="mental-health-experts-assignments-for-users-list-of-assignments-container">
            <div className="mental-health-experts-assignments-for-users-list-of-assignments-container-header">
              <p className="mental-health-experts-assignments-for-users-list-of-assignments-container-header-title">
                Zadaci
              </p>
            </div>
          </div>
        </div>
        {/* Mental Health Expert Assignments for mental health expert with id {id} */}
      </div>
    </section>
  )
}
