import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useFetchLocationState from './custom/hooks/useFetchLocationState'

import {
  getRecentShares,
  getSharesPerMentalHealthExpert,
} from './redux-toolkit/features/regularUserSlice'

import { RecentShares } from './RecentShares'
import { SharedContent } from './SharedContent'
import { Loader } from './Loader'

export const SharesPerMentalHealthExpert = () => {
  let dispatch = useDispatch()
  // let { loggedUser } = useFetchLocationState();
  let { authenticatedUser } = useSelector((store) => store.user)
  let { isLoading } = useSelector((store) => store.regularUser)

  useEffect(() => {
    let query = {
      loggedUserId: authenticatedUser.id,
    }
    dispatch(getSharesPerMentalHealthExpert(query))
    dispatch(getRecentShares(query))
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className="shares-per-mental-health-expert-main-container">
      <h1 className="shares-per-mental-health-expert-title">
        Content shared with mental health experts
      </h1>
      <section className="shares-per-mental-health-expert-content-main-container">
        <SharedContent />
        <RecentShares />
      </section>
    </section>
  )
}
