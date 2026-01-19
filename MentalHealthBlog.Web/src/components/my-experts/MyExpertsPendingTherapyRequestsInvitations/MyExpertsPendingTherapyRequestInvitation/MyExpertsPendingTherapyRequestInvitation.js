import MyExpertsPendingTherapyRequestInvitationCSS from './MyExpertsPendingTherapyRequestInvitation.css'

export const MyExpertsPendingTherapyRequestInvitation = ({ invitation }) => {
  console.log('Invitation ', invitation)
  let mentalHealthExpertFullName = Array.prototype.concat(
    invitation?.mentalHealthExpertFirstName,
    ' ',
    invitation?.mentalHealthExpertLastName
  )
  return (
    <div className="my-mental-health-experts-pending-therapy-requests-invitation-container">
      <div className="my-mental-health-experts-pending-therapy-requests-invitation-header">
        <p className="my-mental-health-experts-pending-therapy-requests-invitation-header-title">
          {mentalHealthExpertFullName} |{' '}
          <span className="my-mental-health-expert-pending-therapy-request-invitation-organization">
            {invitation?.mentalHealthExpertOrganization}
          </span>
        </p>
      </div>
      <div className="my-mental-health-experts-invitation-therapy-request-actions">
        <button type="button">Prihvati</button>
        <button type="button">Odbij</button>
      </div>
    </div>
  )
}
