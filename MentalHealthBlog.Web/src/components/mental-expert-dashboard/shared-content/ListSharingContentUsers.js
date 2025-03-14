import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  getSharesPerUser,
  setOverlayPost,
} from '../../redux-toolkit/features/mentalExpertSlice'
import { expandShrinkSidebar } from '../../utils/helper-methods/methods'

import { BiExpandAlt } from 'react-icons/bi'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)

  let { usersThatSharedIncludingItsContent, usersThatSharedContent } =
    useSelector((store) => store.mentalExpert)

  let query = {
    loggedExpertId: authenticatedUser.id,
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
            expandShrinkSidebar()
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
                  if (window.screen.width <= 550) {
                    expandShrinkSidebar()
                    let contentAndQuery = {
                      userId: user.id,
                      usersThatSharedIncludingItsContent,
                    }
                    dispatch(getSharedContentOfPickedUser(contentAndQuery))
                    dispatch(setOverlayPost(null))
                  }
                  let contentAndQuery = {
                    userId: user.id,
                    usersThatSharedIncludingItsContent,
                  }
                  dispatch(getSharedContentOfPickedUser(contentAndQuery))
                  dispatch(setOverlayPost(null))
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
