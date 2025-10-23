import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getUsersWithSetAssignments } from '../../../redux-toolkit/features/mentalExpertSlice'
import {
  getUsersAssignments,
  setChosenAssignment,
} from '../../../redux-toolkit/features/assignmentSlice'
import { openAssignmentResponses } from '../../../redux-toolkit/features/modalSlice'

import { Navbar } from '../../shared/Navbar/Navbar'
import { AssignmentResponses } from '../../AssignmentResponses/AssignmentResponses'
import { RespondToAssignment } from '../../RespondToAssignment/RespondToAssignment'
import { LiaReadme } from 'react-icons/lia'
import { SlPencil } from 'react-icons/sl'
import { FaUserFriends } from 'react-icons/fa'

import MentalHealthExpertAssignmentsCSS from './MentalHealthExpertAssignments.css'

export const MentalHealthExpertAssignments = () => {
  let dispatch = useDispatch()
  let { usersWithSetAssignments } = useSelector((store) => store.mentalExpert)
  let { dbAssignments } = useSelector((store) => store.assignment)
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isAssignmentResponsesOpen } = useSelector((store) => store.modal)
  let { id } = useParams()

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
      query: {
        loggedExpertId: parseInt(id),
      },
    }
    dispatch(getUsersWithSetAssignments(objectWithData))
  }, [])

  return (
    <section id="mental-health-experts-assignments-for-users-main-container">
      <Navbar />
      <AssignmentResponses />
      <RespondToAssignment />
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
                    let mentalHealthExpertsAssignmentsUsersMainContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-users-main-container'
                      )
                    let mentalHealthExpertsAssignmentsForUsersListOfAssignmentsMainContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-for-users-list-of-assignements-main-container'
                      )
                    let mentalHealthExpertsAssignmentsForUsersContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-for-users-container'
                      )
                    mentalHealthExpertsAssignmentsUsersMainContainer.classList.remove(
                      'mental-health-experts-assignments-users-main-container-expanded'
                    )
                    mentalHealthExpertsAssignmentsForUsersListOfAssignmentsMainContainer.classList.remove(
                      'mental-health-experts-assignments-for-users-list-of-assignements-main-container-shrinked'
                    )
                    mentalHealthExpertsAssignmentsForUsersContainer.classList.remove(
                      'mental-health-experts-assignments-for-users-container-expanded'
                    )

                    let request = {
                      givenById: authenticatedUser?.id,
                      givenToId: user?.id,
                      isMentalHealthExpert: true,
                    }
                    let objectWithData = {
                      authenticatedUser,
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
                <FaUserFriends
                  className="mental-health-experts-assignments-for-users-list-of-assignments-container-header-icon"
                  onClick={() => {
                    let mentalHealthExpertsAssignmentsForUsersContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-for-users-container'
                      )
                    let mentalHealthExpertsAssignmentsForUsersListOfAssignmentsMainContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-for-users-list-of-assignements-main-container'
                      )

                    let mentalHealthExpertsAssignmentsUsersMainContainer =
                      document.querySelector(
                        '.mental-health-experts-assignments-users-main-container'
                      )

                    mentalHealthExpertsAssignmentsForUsersContainer.classList.add(
                      'mental-health-experts-assignments-for-users-container-expanded'
                    )

                    mentalHealthExpertsAssignmentsForUsersListOfAssignmentsMainContainer.classList.add(
                      'mental-health-experts-assignments-for-users-list-of-assignements-main-container-shrinked'
                    )

                    mentalHealthExpertsAssignmentsUsersMainContainer.classList.add(
                      'mental-health-experts-assignments-users-main-container-expanded'
                    )
                  }}
                />
                <span>Zadaci</span>
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
                    onClick={() => {
                      dispatch(
                        openAssignmentResponses(!isAssignmentResponsesOpen)
                      )
                      dispatch(setChosenAssignment(assignment))
                    }}
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
                        {/* <div className="mental-health-experts-assignments-for-users-assignments-assignment-actions-container">
                          <LiaReadme className="mental-health-experts-assignments-for-users-assignments-assignment-actions-icon" />
                          <SlPencil className="mental-health-experts-assignments-for-users-assignments-assignment-actions-icon" />
                        </div> */}
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
