import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  displayProfilesContainer,
  displayStatusActionsContainer,
  getNewRegisteredExperts,
} from '../../../../../redux-toolkit/features/adminSlice'

import { NewExpertProfile } from '../NewExpertProfile/NewExpertProfile'
import { Navbar } from '../../../../shared/Navbar/Navbar'
import { toast } from 'react-toastify'

import NewExpertsCSS from './NewExperts.css'

export const NewExperts = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

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
          toast.error('Korisnici nisu uspješno dohvaćeni!', {
            position: 'bottom-right',
          })
          return
        }

        if (
          data?.payload?.serviceResponseObject.length === 0 &&
          data?.payload?.statusCode === 200
        ) {
          toast.warning('Nema novih zahtjeva!', {
            autoClose: 1500,
            position: 'bottom-right',
          })
          return
        }

        if (data?.payload?.statusCode === 200) {
          toast.success('Zahtjevi spremni za procesiranje!', {
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
        <h2 className="new-experts-title">Upravljajte zahtjevima</h2>
        <h3 className="new-experts-subtitle">Na čekanju</h3>
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
                authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

                let objectWithData = {
                  query: {
                    status: false,
                  },
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Odbijeni'
              }}
            >
              Odbijeni
            </button>
            <button
              className="new-experts-status-button approved"
              type="button"
              onClick={() => {
                authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

                let objectWithData = {
                  query: {
                    status: true,
                  },
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Prihvaćeni'
              }}
            >
              Prihvaćeni
            </button>
            <button
              className="new-experts-status-button pending"
              type="button"
              onClick={() => {
                authenticatedUserLocalStorage =
                  localStorage.getItem('authenticatedUser')
                authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

                let objectWithData = {
                  authenticatedUser,
                }
                dispatch(displayProfilesContainer())
                dispatch(getNewRegisteredExperts(objectWithData))
                document.querySelector('.new-experts-subtitle').innerHTML =
                  'Na čekanju'
              }}
            >
              Na čekanju
            </button>
          </div>
        </div>

        {newlyRegisteredMentalHealthExperts?.length > 0 ? (
          <div className="new-experts-main-profiles-container">
            {newlyRegisteredMentalHealthExperts?.map((expert) => {
              return <NewExpertProfile key={expert.userId} expert={expert} />
            })}
          </div>
        ) : (
          <div className="new-experts-main-profiles-container">
            <span className="new-experts-main-profiles-container-requests-information">
              Svi zahtjevi su uspješno procesirani!
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
