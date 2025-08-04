import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  displayProfilesContainer,
  displayStatusActionsContainer,
  getNewRegisteredExperts,
} from '../../../redux-toolkit/features/adminSlice'

import { NewMentalHealthExpertProfile } from './NewMentalHealthExpertProfile'
import { Navbar } from '../../../shared/Navbar'
import { toast } from 'react-toastify'

export const NewExperts = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)

  let { newlyRegisteredMentalHealthExperts } = useSelector(
    (store) => store.admin
  )

  useEffect(() => {
    let objectWithData = {
      authenticatedUser,
    }
    dispatch(getNewRegisteredExperts(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 404) {
          toast.error("Users couldn't be fetced properly!", {
            position: 'bottom-right',
          })
          return
        }

        if (
          data?.payload?.serviceResponseObject.length === 0 &&
          data?.payload?.statusCode === 200
        ) {
          toast.warning('There are no new requests!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }

        if (data?.payload?.statusCode === 200) {
          toast.success('Succesfully fetched requests!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
        }
      }
    })
  }, [])

  return (
    <section id="new-experts-main-container">
      <Navbar />
      <div className="new-experts-header">
        <h2 className="new-experts-title">Manage new requests</h2>
        <h3 className="new-experts-subtitle">Pending</h3>
      </div>
      <div className="new-experts-container">
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
                let objectWithData = {
                  query: {
                    status: false,
                  },
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Rejected'
              }}
            >
              Rejected
            </button>
            <button
              className="new-experts-status-button approved"
              type="button"
              onClick={() => {
                let objectWithData = {
                  query: {
                    status: true,
                  },
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Approved'
              }}
            >
              Approved
            </button>
            <button
              className="new-experts-status-button pending"
              type="button"
              onClick={() => {
                let objectWithData = {
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Pending'
              }}
            >
              Pending
            </button>
          </div>
        </div>

        {newlyRegisteredMentalHealthExperts?.length > 0 ? (
          <div className="new-experts-main-profiles-container">
            {newlyRegisteredMentalHealthExperts?.map((expert) => {
              return (
                <NewMentalHealthExpertProfile
                  key={expert.userId}
                  expert={expert}
                />
              )
            })}
          </div>
        ) : (
          <div className="new-experts-main-profiles-container">
            <span className="new-experts-main-profiles-container-requests-information">
              All requests are properly processed!
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
