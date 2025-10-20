import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExpertsThatGaveAssignmentsToUser } from '../../redux-toolkit/features/regularUserSlice'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { stringIsNullOrEmpty } from '../../utils/helper-methods/methods'

import defaultAvatar from '../../images/default-avatar.png'

import UserAssignmentsCSS from './UserAssignments.css'
import { getUsersAssignments } from '../../redux-toolkit/features/assignmentSlice'
import moment from 'moment'

export const UserAssignments = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { expertsThatGaveAssignmentsToUser } = useSelector(
    (store) => store.regularUser
  )
  let { dbAssignments } = useSelector((store) => store.assignment)

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

        {/* Zadaca koju je dobio korisnik otvara se samo ako se klikne na korisnika */}
        <div className="user-assignments-assignments-main-container">
          <p className="user-assignments-assignment-main-container-title">
            Zadaća
          </p>
          <div className="user-assignments-assignments-container">
            {dbAssignments?.map((assignment) => {
              let charactersCountInContent = assignment?.content?.length
              let contentCut = assignment?.content?.substr(0, 35)?.concat('...')
              let writtenAt = moment(assignment?.writtenAt).format('DD/MM/yyyy')
              return (
                <div
                  key={assignment?.id}
                  className="user-assignments-given-assignment-main-container"
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
