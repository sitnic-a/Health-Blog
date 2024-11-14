import React from 'react'
import { ListSharingContentUsers } from '../components/ListSharingContentUsers'

export const MentalExpertDashboard = () => {
  return (
    <section className="mental-expert-dashboard">
      <section id="sharing-users-main-container">
        <ListSharingContentUsers />
      </section>
    </section>
  )
}
