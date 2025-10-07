import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUsersWithSetAssignments } from '../../../redux-toolkit/features/mentalExpertSlice'

import { Navbar } from '../../shared/Navbar/Navbar'

import AssignmentsCSS from './Assignments.css'

export const Assignments = () => {
  let dispatch = useDispatch()
  let { usersWithSetAssignments } = useSelector((store) => store.mentalExpert)
  let { id } = useParams()
  console.log('Id ', id)

  useEffect(() => {
    let objectWithData = {
      query: {
        loggedExpertId: parseInt(id),
      },
    }
    console.log('Object with data ', objectWithData)

    dispatch(getUsersWithSetAssignments(objectWithData))
  }, [])

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
          <div className="mental-health-experts-assignments-users-container">
            {usersWithSetAssignments.map((user) => {
              return (
                <div
                  className="mental-health-experts-assignments-users-user"
                  key={user?.id}
                  onClick={() => alert('Id ' + user?.id)}
                >
                  <span className="mental-health-experts-assignments-users-user-title">
                    {user?.username}
                  </span>
                </div>
              )
            })}
          </div>
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
