import React from 'react'
import { useSelector } from 'react-redux'
import { ListSharingContentUsers } from '../components/ListSharingContentUsers'
import { ListSharedContent } from '../components/ListSharedContent'

export const MentalExpertDashboard = () => {
  let { sharedContent } = useSelector((store) => store.mentalExpert)

  return (
    <section className="mental-expert-dashboard">
      <section id="sharing-users-main-container">
        <ListSharingContentUsers />
        {sharedContent.length > 0 && (
          <ListSharedContent sharedContent={[...sharedContent]} />
        )}
      </section>
    </section>
  )
}
