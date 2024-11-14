import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOnlyUsersThatSharedContent,
  getSharedContentOfPickedUser,
  getSharesPerUser,
} from './redux-toolkit/features/mentalExpertSlice'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()
  let { usersThatSharedIncludingItsContent, usersThatSharedContent } =
    useSelector((store) => store.mentalExpert)
  let location = useLocation()
  let loggedUser = location.state.loggedUser

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
