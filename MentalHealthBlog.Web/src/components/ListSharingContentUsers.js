import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOnlyUsersThatSharedContent,
  getSharesPerUser,
} from './redux-toolkit/features/mentalExpertSlice'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()
  let { usersThatSharedContent } = useSelector((store) => store.mentalExpert)
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
              <div className="sharing-user-user-container" key={user.id}>
                <span className="sharing-user-title">{user.username}</span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
