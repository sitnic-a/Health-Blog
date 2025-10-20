import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getExpertsThatGaveAssignmentsToUser } from '../../redux-toolkit/features/regularUserSlice'
import { Navbar } from '../../components/shared/Navbar/Navbar'
import { stringIsNullOrEmpty } from '../../utils/helper-methods/methods'

import defaultAvatar from '../../images/default-avatar.png'

import UserAssignmentsCSS from './UserAssignments.css'

export const UserAssignments = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
  let { expertsThatGaveAssignmentsToUser } = useSelector(
    (store) => store.regularUser
  )
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
    </section>
  )
}
