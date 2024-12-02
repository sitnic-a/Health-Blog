import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetchLocationState from '../../custom/hooks/useFetchLocationState'
import {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  getSharesPerUser,
} from '../../redux-toolkit/features/mentalExpertSlice'

import { BiExpandAlt } from 'react-icons/bi'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()
  let { usersThatSharedIncludingItsContent, usersThatSharedContent } =
    useSelector((store) => store.mentalExpert)

  let { loggedUser } = useFetchLocationState()

  let query = {
    loggedExpertId: loggedUser.id,
  }

  useEffect(() => {
    dispatch(getSharesPerUser(query)).then((data) => {
      dispatch(getOnlyUsersThatSharedContent(data))
    })
  }, [])

  return (
    <section className="sharing-users-main-users-container">
      <div className="sharing-users-expander-action">
        <span
          className="sharing-users-expander-icon"
          onClick={() => {
            let sharingUsersMainUsersContainer = document.querySelector(
              '.sharing-users-main-users-container'
            )
            sharingUsersMainUsersContainer.classList.toggle(
              'sharing-users-main-users-container-expanded'
            )

            let sharingUsersUserContainer = document.querySelector(
              '.sharing-user-user-container'
            )
            sharingUsersUserContainer.classList.toggle(
              'sharing-user-user-container-expanded'
            )

            let sharingUserTitle = document.querySelector('.sharing-user-title')
            sharingUserTitle.classList.toggle('sharing-user-title-expanded')

            let sharingUsersContentContainer = document.querySelector(
              '.sharing-users-content-container'
            )
            if (sharingUsersContentContainer !== null) {
              sharingUsersContentContainer.classList.toggle(
                'sharing-users-content-container-shrinked'
              )
            }
          }}
        >
          <BiExpandAlt />
        </span>
      </div>
      <div className="sharing-users-users-container">
        {usersThatSharedContent.length > 0 &&
          usersThatSharedContent.map((user) => {
            return (
              <div
                className="sharing-user-user-container"
                key={user.id}
                onClick={() => {
                  let contentAndQuery = {
                    userId: user.id,
                    usersThatSharedIncludingItsContent,
                  }
                  dispatch(getSharedContentOfPickedUser(contentAndQuery))

                  let sharingUsersMainUsersContainer = document.querySelector(
                    '.sharing-users-main-users-container'
                  )
                  sharingUsersMainUsersContainer.classList.toggle(
                    'sharing-users-main-users-container-expanded'
                  )

                  let sharingUsersUserContainer = document.querySelector(
                    '.sharing-user-user-container'
                  )
                  sharingUsersUserContainer.classList.toggle(
                    'sharing-user-user-container-expanded'
                  )

                  let sharingUserTitle = document.querySelector(
                    '.sharing-user-title'
                  )
                  sharingUserTitle.classList.toggle(
                    'sharing-user-title-expanded'
                  )
                }}
              >
                <span className="sharing-user-title">{user.username}</span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
