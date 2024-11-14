import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSharesPerUser } from './redux-toolkit/features/mentalExpertSlice'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()
  let { usersThatSharedContent } = useSelector((store) => store.mentalExpert)
  let location = useLocation()
  let loggedUser = location.state.loggedUser

  let query = {
    loggedExpertId: loggedUser.id,
  }

  useEffect(() => {
    dispatch(getSharesPerUser(query))
    console.log('Users ', usersThatSharedContent)
  }, [])

  return (
    <section id="sharing-users-main-container">
      <section className="sharing-users-users-container">
        {usersThatSharedContent.length > 0 &&
          usersThatSharedContent.map((user) => {
            return (
              <div key={user.id}>
                <span>{user.username}</span>
              </div>
            )
          })}
      </section>
    </section>
  )
}
