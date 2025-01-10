import { FaCheck } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

export const NewMentalHealthExpertProfileActions = () => {
  return (
    <div className="new-expert-profile-bio-actions">
      <div className="new-expert-profile-action">
        <button
          className="new-expert-profile-action-btn new-expert-profile-accept-btn"
          type="button"
          title="Accept"
        >
          <FaCheck className="new-expert-profile-action-icon new-expert-profile-action-accept-icon" />
        </button>
      </div>
      <div className="new-expert-profile-action">
        <button
          className="new-expert-profile-action-btn new-expert-profile-reject-btn"
          type="button"
          title="Reject"
        >
          <HiX className="new-expert-profile-action-icon new-expert-profile-action-reject-icon" />
        </button>
      </div>
    </div>
  )
}
