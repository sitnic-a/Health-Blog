import { useDispatch, useSelector } from 'react-redux'
import {
  getNewRegisteredExperts,
  setRegisteredExpertStatus,
} from '../../../../../redux-toolkit/features/adminSlice'
import { toast } from 'react-toastify'
import { FaCheck } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

import NewExpertProfileActionsCSS from './NewExpertProfileActions.css'

export const NewExpertProfileActions = (props) => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let expert = props.expert
  return (
    <div className="new-expert-profile-bio-actions">
      <div className="new-expert-profile-action">
        <button
          onClick={() => {
            authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

            let objectWithData = {
              patchDto: {
                mentalHealthExpertId: expert.userId,
                isApproved: true,
                isRejected: false,
              },
              authenticatedUser,
            }
            dispatch(setRegisteredExpertStatus(objectWithData)).then((data) => {
              let statusCode = data?.payload?.StatusCode

              if (statusCode !== 200) {
                if (statusCode === 400) {
                  toast.error('Status nije promijenjen!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }

                if (statusCode === 404) {
                  toast.error('Stručnjak nije pronađen!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }
              }

              if (data.payload.statusCode === 200) {
                toast.success('Zahtjev uspješno odobren!', {
                  autoClose: 2000,
                  position: 'bottom-right',
                })
                let objectWithData = {
                  authenticatedUser,
                }
                dispatch(getNewRegisteredExperts(objectWithData))
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
            authenticatedUserLocalStorage =
              localStorage.getItem('authenticatedUser')
            authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

            let objectWithData = {
              patchDto: {
                mentalHealthExpertId: expert.userId,
                isApproved: false,
                isRejected: true,
              },
              authenticatedUser,
            }
            dispatch(setRegisteredExpertStatus(objectWithData)).then((data) => {
              let statusCode = data?.payload?.StatusCode

              if (statusCode !== 200) {
                if (statusCode === 400) {
                  toast.error('Status nije promijenjen!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }

                if (statusCode === 404) {
                  toast.error('Stručnjak nije pronađen!', {
                    autoClose: 3000,
                    position: 'bottom-right',
                  })
                  return
                }
              }

              if (data?.payload?.statusCode === 200) {
                toast.success('Zahtjev uspješno odbijen!', {
                  autoClose: 2000,
                  position: 'bottom-right',
                })
                let objectWithData = {
                  authenticatedUser,
                }
                dispatch(getNewRegisteredExperts(objectWithData))
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
