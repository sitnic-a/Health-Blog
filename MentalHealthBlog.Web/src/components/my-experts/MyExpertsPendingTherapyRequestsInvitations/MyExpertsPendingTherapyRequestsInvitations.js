import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMentalHealthExpertsWhoSentUserAnInvitationForTherapy } from '../../../redux-toolkit/features/therapySlice'
import { requestStatuses } from '../../../enums/requestStatuses'
import { MyExpertsPendingTherapyRequestInvitation } from './MyExpertsPendingTherapyRequestInvitation/MyExpertsPendingTherapyRequestInvitation'

import MyExpertsPendingTherapyRequestsInvitationsCSS from './MyExpertsPendingTherapyRequestsInvitations.css'

export const MyExpertsPendingTherapyRequestsInvitations = () => {
  let dispatch = useDispatch()
  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let {
    myPendingMentalHealthExpertWhoSentAnInvitationForTherapy,
    myApprovedOrPendingMentalHealthExperts,
  } = useSelector((store) => store.therapy)

  //ova mi varijabla ispod treba kada budem trebao sklanjati pozivnice, a to je ukoliko user vec ima na cekanju nekoga
  // ili vec potvrdene eksperte

  //   console.log('My current ', myApprovedOrPendingMentalHealthExperts)

  useEffect(() => {
    authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
    authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
    let query = {
      loggedUserId: authenticatedUser?.id,
      requestStatus: requestStatuses.PENDING,
      isMentalHealthExpertInviting: true,
    }
    let objectWithData = {
      authenticatedUser,
      query,
    }
    dispatch(
      getMentalHealthExpertsWhoSentUserAnInvitationForTherapy(objectWithData)
    )
  }, [])

  return (
    <section className="my-mental-health-experts-pending-therapy-requests-invitations-main-container">
      <div className="my-mental-health-experts-pending-therapy-requests-invitations-header">
        <h3 className="my-mental-health-experts-pending-therapy-requests-invitations-header-title">
          Stručnjaci koji su Vam poslali zahtjev
        </h3>
        <p className="my-mental-health-experts-pending-therapy-requests-invitations-header-description">
          Ispod možete pregledati listu stručnjaka koji su Vam poslali zahtjev
          da se povežete! Navedeni su tako da prvo vidite njihovo ime i prezime,
          a zatim organizaciju, savjetovalište ili ordinaciju koju
          predstavljaju!
        </p>
      </div>

      {myPendingMentalHealthExpertWhoSentAnInvitationForTherapy?.map(
        (pendingTherapyRequestInvitation) => {
          return (
            <MyExpertsPendingTherapyRequestInvitation
              key={pendingTherapyRequestInvitation?.mentalHealthExpertUserId}
              invitation={pendingTherapyRequestInvitation}
            />
          )
        }
      )}
    </section>
  )
}
