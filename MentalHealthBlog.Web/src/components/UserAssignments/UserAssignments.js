import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getExpertsThatGaveAssignmentsToUser } from '../../redux-toolkit/features/regularUserSlice'
import {
  getUsersAssignments,
  setChosenAssignment,
} from '../../redux-toolkit/features/assignmentSlice'
import { openAssignmentResponses } from '../../redux-toolkit/features/modalSlice'
import { stringIsNullOrEmpty } from '../../utils/helper-methods/methods'

import defaultAvatar from '../../images/default-avatar.png'
import { AssignmentResponses } from '../AssignmentResponses/AssignmentResponses'
import { RespondToAssignment } from '../RespondToAssignment/RespondToAssignment'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { FaUserFriends } from 'react-icons/fa'

import UserAssignmentsCSS from './UserAssignments.css'

export const UserAssignments = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { expertsThatGaveAssignmentsToUser } = useSelector(
    (store) => store.regularUser
  )
  let { dbAssignments } = useSelector((store) => store.assignment)
  let { isAssignmentResponsesOpen } = useSelector((store) => store.modal)

  useEffect(() => {
    let query = {
      loggedUserId: authenticatedUser?.id,
    }
    let objectWithData = {
      authenticatedUser,
      query,
    }

    dispatch(getExpertsThatGaveAssignmentsToUser(objectWithData))
  }, [])

  return (
    <section id="user-assignments-main-container">
      <Navbar />
      <AssignmentResponses />
      <RespondToAssignment />

      <div className="user-assignments-container">
        <div className="user-assignments-assignments-from-main-container">
          <p className="user-assignments-assignments-from-main-container-title">
            Zadaću zadali:
          </p>
          <div className="user-assignments-assignments-from-container">
            {expertsThatGaveAssignmentsToUser?.map((expert) => {
              let base64Photo = `data:image/png;base64,${expert?.photoAsFile}`
              return (
                <div
                  key={expert?.userId}
                  className="user-assignments-user-that-gave-assignment-main-container"
                  onClick={() => {
                    let usersAssignmentsAssignementsFromMainContainer =
                      document.querySelector(
                        '.user-assignments-assignments-from-main-container'
                      )
                    let usersAssignmentsAssignmentsMainContainer =
                      document.querySelector(
                        '.user-assignments-assignments-main-container'
                      )

                    usersAssignmentsAssignementsFromMainContainer.classList.remove(
                      'user-assignments-assignments-from-main-container-expanded'
                    )
                    usersAssignmentsAssignmentsMainContainer.classList.remove(
                      'user-assignments-assignments-main-container-shrinked'
                    )

                    let request = {
                      givenById: expert?.userId,
                      givenToId: authenticatedUser?.id,
                      isMentalHealthExpert: false,
                    }

                    let objectWithData = {
                      authenticatedUser,
                      request,
                    }
                    dispatch(getUsersAssignments(objectWithData))
                  }}
                >
                  <div className="user-assignments-user-that-gave-assignment-image-container">
                    <img
                      className="user-assignments-user-that-gave-assignment-image"
                      src={
                        !stringIsNullOrEmpty(expert?.photoAsFile)
                          ? base64Photo
                          : defaultAvatar
                      }
                      alt="Stručnjak za mentalno zdravlje"
                    />
                  </div>

                  <div className="user-assignments-user-that-gave-assignment-info">
                    <span className="user-assignments-user-that-gave-assignment-info-username">
                      {expert?.username}
                    </span>
                    <hr className="user-assignments-user-that-gave-assignment-separator" />
                    <span className="user-assignments-user-that-gave-assignment-info-organization">
                      {expert?.organization}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="user-assignments-assignments-main-container">
          <div className="user-assignments-assignments-header">
            <FaUserFriends
              className="user-assignments-assignments-header-experts-icon"
              onClick={() => {
                let usersAssignmentsAssignementsFromMainContainer =
                  document.querySelector(
                    '.user-assignments-assignments-from-main-container'
                  )
                let usersAssignmentsAssignmentsMainContainer =
                  document.querySelector(
                    '.user-assignments-assignments-main-container'
                  )

                usersAssignmentsAssignementsFromMainContainer.classList.add(
                  'user-assignments-assignments-from-main-container-expanded'
                )
                usersAssignmentsAssignmentsMainContainer.classList.add(
                  'user-assignments-assignments-main-container-shrinked'
                )
              }}
            />
            <p className="user-assignments-assignment-main-container-title">
              Zadaća
            </p>
          </div>
          <div className="user-assignments-assignments-container">
            {dbAssignments?.map((assignment) => {
              let charactersCountInContent = assignment?.content?.length
              let contentCut = assignment?.content?.substr(0, 35)?.concat('...')
              let writtenAt = moment(assignment?.writtenAt).format('DD/MM/yyyy')
              return (
                <div
                  key={assignment?.id}
                  className="user-assignments-given-assignment-main-container"
                  onClick={() => {
                    dispatch(
                      openAssignmentResponses(!isAssignmentResponsesOpen)
                    )
                    dispatch(setChosenAssignment(assignment))
                  }}
                >
                  <div className="user-assignments-given-assignment-container">
                    <p className="user-assignments-given-assignment-content">
                      {charactersCountInContent > contentCut?.length
                        ? contentCut
                        : assignment?.content}
                    </p>

                    <p className="user-assignments-given-assignment-date">
                      {writtenAt}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
