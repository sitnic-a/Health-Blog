import { useDispatch } from 'react-redux'
import {
  getNewRegisteredExperts,
  setRegisteredExpertStatus,
} from '../../../redux-toolkit/features/adminSlice'
import { toast } from 'react-toastify'
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
              isApproved: true,
              isRejected: false,
            }
            dispatch(setRegisteredExpertStatus(patchDto)).then((data) => {
              console.log('LOGGG ', data)

              if (data.payload.statusCode === 200) {
                toast.success('Successfully approved mental health expert', {
                  autoClose: 2000,
                  position: 'bottom-right',
                })
                dispatch(getNewRegisteredExperts())
              }
            })
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
              isApproved: false,
              isRejected: true,
            }
            dispatch(setRegisteredExpertStatus(patchDto)).then((data) => {
              if (data.payload.statusCode === 200) {
                toast.success('Successfully rejected mental health expert', {
                  autoClose: 2000,
                  position: 'bottom-right',
                })
                dispatch(getNewRegisteredExperts())
              }
            })
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
