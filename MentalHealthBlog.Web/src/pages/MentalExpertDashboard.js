import React from 'react'
import { useSelector } from 'react-redux'
import { ListSharingContentUsers } from '../components/mental-expert-dashboard/shared-content/ListSharingContentUsers'
import { ListSharedContent } from '../components/mental-expert-dashboard/shared-content/ListSharedContent'
import { Logout } from '../components/shared/Logout'
import { ReviewAssignmentsButton } from '../components/shared/ReviewAssignmentsButton'

export const MentalExpertDashboard = () => {
  let { sharedContent } = useSelector((store) => store.mentalExpert)

  return (
    <section className="mental-expert-dashboard">
      <div className="mental-expert-navigation-bar">
        <div className="left">
          <ReviewAssignmentsButton />
        </div>
        <Logout />
      </div>
      <section id="sharing-users-main-container">
        <ListSharingContentUsers />
        {sharedContent.length > 0 && (
          <ListSharedContent sharedContent={[...sharedContent]} />
        )}
      </section>
    </section>
  )
}
