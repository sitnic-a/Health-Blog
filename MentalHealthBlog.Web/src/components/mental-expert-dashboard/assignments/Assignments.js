import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUsersWithSetAssignments } from '../../../redux-toolkit/features/mentalExpertSlice'

import { Navbar } from '../../shared/Navbar/Navbar'

import AssignmentsCSS from './Assignments.css'
import { getUsersAssignments } from '../../../redux-toolkit/features/assignmentSlice'

import { LiaReadme } from 'react-icons/lia'
import { SlPencil } from 'react-icons/sl'
import moment from 'moment'

export const Assignments = () => {
  let dispatch = useDispatch()
  let { usersWithSetAssignments } = useSelector((store) => store.mentalExpert)
  let { dbAssignments } = useSelector((store) => store.assignment)
  let { authenticatedUser } = useSelector((store) => store.user)
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
                  onClick={() => {
                    let request = {
                      givenById: authenticatedUser?.id,
                      givenToId: user?.id,
                      isMentalHealthExpert: true,
                    }
                    let objectWithData = {
                      request,
                    }
                    dispatch(getUsersAssignments(objectWithData))
                  }}
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
            <div className="mental-health-experts-assignments-for-users-assignments-container">
              {dbAssignments.map((assignment) => {
                let charactersCountInContent = assignment?.content?.length
                let contentCut = assignment?.content
                  ?.substr(0, 35)
                  ?.concat('...')
                let writtenAt = moment(assignment?.writtenAt).format(
                  'DD/MM/yyyy'
                )
                return (
                  <div
                    key={assignment?.id}
                    className="mental-health-experts-assignments-for-users-assignments-assignment-main-container"
                  >
                    <div className="mental-health-experts-assignments-for-users-assignments-assignment-container">
                      <div className="mental-health-experts-assignments-for-users-assignments-assignment-container-header">
                        <p
                          className="mental-health-experts-assignments-for-users-assignments-assignment-content"
                          title={assignment?.content}
                        >
                          {charactersCountInContent > contentCut?.length
                            ? contentCut
                            : assignment?.content}
                        </p>
                        <div className="mental-health-experts-assignments-for-users-assignments-assignment-actions-container">
                          <LiaReadme className="mental-health-experts-assignments-for-users-assignments-assignment-actions-icon" />
                          <SlPencil className="mental-health-experts-assignments-for-users-assignments-assignment-actions-icon" />
                        </div>
                      </div>

                      <div className="mental-health-experts-assignments-for-users-assignments-assignment-date-container">
                        <p className="mental-health-experts-assignments-for-users-assignments-assignment-date">
                          {writtenAt}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {/* Mental Health Expert Assignments for mental health expert with id {id} */}
      </div>
    </section>
  )
}
