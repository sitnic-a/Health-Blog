import { useDispatch, useSelector } from 'react-redux'

import { NewMentalHealthExpertProfile } from './NewMentalHealthExpertProfile'
import {
  displayProfilesContainer,
  displayStatusActionsContainer,
  getNewRegisteredExperts,
} from '../../../redux-toolkit/features/adminSlice'
export const NewExperts = () => {
  let dispatch = useDispatch()

  let { newlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  )
  console.log(newlyRegisteredMentalHealthExperts)

  return (
    <div className="new-experts-main-container">
      <div
        className="new-experts-status-hamburger"
        onClick={() => dispatch(displayStatusActionsContainer())}
      >
        <span>+</span>
      </div>
      <div className="new-experts-status-actions-container">
        <div className="new-experts-status-button-container">
          <button
            className="new-experts-status-button rejected"
            type="button"
            onClick={() => {
              let query = {
                status: false,
              }
              dispatch(displayProfilesContainer())
              dispatch(getNewRegisteredExperts(query))
            }}
          >
            Rejected
          </button>
          <button
            className="new-experts-status-button approved"
            type="button"
            onClick={() => {
              let query = {
                status: true,
              }
              dispatch(displayProfilesContainer())
              dispatch(getNewRegisteredExperts(query))
            }}
          >
            Approved
          </button>
          <button
            className="new-experts-status-button approved"
            type="button"
            onClick={() => {
              dispatch(displayProfilesContainer())
              dispatch(getNewRegisteredExperts())
            }}
          >
            Pending
          </button>
        </div>
      </div>
      {newlyRegisteredMentalHealthExperts.length > 0 ? (
        <div className="new-experts-main-profiles-container">
          {newlyRegisteredMentalHealthExperts.map((expert) => {
            return (
              <NewMentalHealthExpertProfile key={expert.id} expert={expert} />
            )
          })}
        </div>
      ) : (
        <div className="new-experts-main-profiles-container">
          <span>Empty</span>
        </div>
      )}
    </div>
  )
}
