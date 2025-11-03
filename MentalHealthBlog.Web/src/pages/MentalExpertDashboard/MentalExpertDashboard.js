import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOnlyUsersThatSharedContent,
  getSharesPerUser,
} from '../../redux-toolkit/features/mentalExpertSlice'
import { toast } from 'react-toastify'
import { ListSharingContentUsers } from '../../components/mental-expert-dashboard/shared-content/ListSharingContentUsers/ListSharingContentUsers'
import { ListSharedContent } from '../../components/mental-expert-dashboard/shared-content/ListSharedContent/ListSharedContent'
import { Navbar } from '../../components/shared/Navbar/Navbar'

import { LandingNotConfirmedMentalHealthExpert } from '../../components/LandingNotConfirmedMentalHealthExpert/LandingNotConfirmedMentalHealthExpert'

import MentalExpertDashboardCSS from './MentalExpertDashboard.css'
import { getUsersTrialPeriod } from '../../redux-toolkit/features/subscriptionSlice'

export const MentalExpertDashboard = () => {
  let dispatch = useDispatch()
  let isPending = localStorage.getItem('isPending')
  let { sharedContent, usersThatSharedIncludingItsContent } = useSelector(
    (store) => store.mentalExpert
  )
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let objectWithData = {
    query: {
      loggedExpertId: authenticatedUser?.id,
    },
    authenticatedUser,
  }

  useEffect(() => {
    if (!authenticatedUser?.isUsingForTheFirstTime) {
      let objectWithData = {
        authenticatedUser,
      }
      dispatch(getUsersTrialPeriod(objectWithData))
      console.log('Counting....')
    }

    dispatch(getSharesPerUser(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode

      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error('Nije moguće dobaviti sadržaj!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
        if (statusCode === 404) {
          toast.error('Sadržaj nije uspješno dobavljen!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
      }

      if (data?.payload?.serviceResponseObject?.length === 0) {
        toast.warning('Trenutno nema podijeljenog sadržaja', {
          autoClose: 3000,
          position: 'bottom-right',
        })
      }

      if (data?.payload?.serviceResponseObject?.length > 0) {
        toast.success('Uspješno dobavljen sadržaj!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
      }

      dispatch(getOnlyUsersThatSharedContent(data))
    })
  }, [])

  return (
    <>
      {isPending ? (
        <LandingNotConfirmedMentalHealthExpert />
      ) : (
        <section className="mental-expert-dashboard">
          <Navbar />

          <section id="sharing-users-main-container">
            <ListSharingContentUsers />

            {usersThatSharedIncludingItsContent?.length === 0 && (
              <div className="sharing-users-main-content-container">
                <div className="sharing-users-main-content-info">
                  <p>Trenutno nema sadržaja podijeljenog sa Vama</p>
                </div>
              </div>
            )}

            {usersThatSharedIncludingItsContent?.length > 0 &&
              sharedContent?.length === 0 && (
                <div className="sharing-users-main-content-container">
                  <div className="sharing-users-main-content-info">
                    <p>
                      <span>PODSJETNIK: </span>Ukoliko želite pregledati
                      podijeljeni sadržaj nekog korisnika kliknite na ime
                      korisnika ili na strelice u gornjem lijevom uglu kako
                      biste otvorili listu svih korisnika koji su dijelili
                      sadržaj sa Vama. Strelice se pojavljuju u slučaju da
                      aplikaciju koristite na uređajima sa manjim ekranima!
                    </p>
                  </div>
                </div>
              )}

            {sharedContent?.length > 0 && (
              <ListSharedContent sharedContent={[...sharedContent]} />
            )}
          </section>
        </section>
      )}
    </>
  )
}
