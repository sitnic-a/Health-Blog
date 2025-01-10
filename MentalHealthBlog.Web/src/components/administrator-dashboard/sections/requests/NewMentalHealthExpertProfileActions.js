import { useDispatch } from 'react-redux'
import {
  getNewRegisteredExperts,
  setRegisteredExpertStatus,
} from '../../../redux-toolkit/features/adminSlice'
import { FaCheck } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

export const NewMentalHealthExpertProfileActions = (props) => {
  let dispatch = useDispatch()
  let expert = props.expert
  return (
    <div className="new-expert-profile-bio-actions">
      <div className="new-expert-profile-action">
        <button
          onClick={() => {
            let patchDto = {
              mentalHealthExpertId: expert.userId,
              approval: true,
            }
            dispatch(setRegisteredExpertStatus(patchDto)).then(() =>
              getNewRegisteredExperts()
            )
          }}
          className="new-expert-profile-action-btn new-expert-profile-accept-btn"
          type="button"
          title="Accept"
        >
          <FaCheck className="new-expert-profile-action-icon new-expert-profile-action-accept-icon" />
        </button>
      </div>
      <div className="new-expert-profile-action">
        <button
          onClick={() => {
            let patchDto = {
              mentalHealthExpertId: expert.userId,
              approval: false,
            }
            dispatch(setRegisteredExpertStatus(patchDto)).then(() =>
              getNewRegisteredExperts()
            )
          }}
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
