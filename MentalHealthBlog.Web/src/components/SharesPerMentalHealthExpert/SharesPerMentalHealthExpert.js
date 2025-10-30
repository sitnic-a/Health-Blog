import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRecentShares,
  getSharesPerMentalHealthExpert,
} from '../../redux-toolkit/features/regularUserSlice'

import { RecentShares } from '../RecentShares/RecentShares'
import { SharedContent } from '../SharedContent/SharedContent'
import { Loader } from '../shared/Loader/Loader'
import { toast } from 'react-toastify'
import { BiError } from 'react-icons/bi'

import SharesPerMentalHealthExpertCSS from './SharesPerMentalHealthExpert.css'

export const SharesPerMentalHealthExpert = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)
  let {
    sharesPerMentalHealthExpert,
    isLoading,
    successfullyFetchedSharesPerMentalHealthExpert,
    successfullyFetchedRecentShares,
  } = useSelector((store) => store.regularUser)

  useEffect(() => {
    let objectWithData = {
      query: {
        loggedUserId: authenticatedUser.id,
      },
      authenticatedUser,
    }

    dispatch(getSharesPerMentalHealthExpert(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error('Postove nije moguće dobaviti!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Postovi nisu ispravno dobavljeni!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
      }
    })

    dispatch(getRecentShares(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode
      let recentShares = data?.payload?.serviceResponseObject
      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error('Postove nije moguće dobaviti!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Postovi nedavno podijeljeni nisu ispravno dobavljeni!', {
            autoClose: 3000,
            position: 'bottom-right',
          })
          return
        }
      }

      if (recentShares?.length > 0 && successfullyFetchedRecentShares) {
        toast.success('Uspješno dobavljeni nedavno podijeljeni postovi!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
        return
      }

      if (recentShares?.length === 0) {
        toast.warning('Trenutno nema nedavno podijeljenih postova!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
        return
      }
    })
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className="shares-per-mental-health-expert-main-container">
      <h1 className="shares-per-mental-health-expert-title">
        Sadržaj podijeljen sa stručnjacima za mentalno zdravlje
      </h1>

      {sharesPerMentalHealthExpert?.length > 0 && (
        <section className="shares-per-mental-health-expert-content-main-container">
          <SharedContent />
          <RecentShares />
        </section>
      )}

      {sharesPerMentalHealthExpert?.length === 0 &&
        successfullyFetchedSharesPerMentalHealthExpert && (
          <section className="shares-per-mental-health-expert-content-main-container">
            <p>Ništa od postojećeg sadržaja nije dijeljeno!</p>
          </section>
        )}

      {successfullyFetchedSharesPerMentalHealthExpert === false && (
        <section className="shares-per-mental-health-expert-content-main-container">
          <div className="shares-per-mental-health-expert-error-container">
            <BiError className="shares-per-mental-health-expert-error-icon" />
            <div className="shares-per-mental-health-expert-error-messages">
              <span className="shares-per-mental-health-expert-error-description">
                Postove nije moguće učitati!
              </span>
              <br />
              <span className="shares-per-mental-health-expert-error-description">
                Ukoliko se ovaj problem nastavi dešavati, molimo kontaktirajte
                podršku
              </span>
            </div>
          </div>
        </section>
      )}
    </section>
  )
}
