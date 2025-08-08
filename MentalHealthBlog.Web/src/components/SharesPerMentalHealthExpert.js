import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRecentShares,
  getSharesPerMentalHealthExpert,
} from './redux-toolkit/features/regularUserSlice'

import { RecentShares } from './RecentShares'
import { SharedContent } from './SharedContent'
import { Loader } from './shared/Loader/Loader'
import { toast } from 'react-toastify'
import { BiError } from 'react-icons/bi'

export const SharesPerMentalHealthExpert = () => {
  let dispatch = useDispatch()
  let { authenticatedUser } = useSelector((store) => store.user)
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
          toast.error("Content doesn't exist!", {
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Posts are not fetched properly!', {
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
          toast.error("Content doesn't exist!", {
            position: 'bottom-right',
          })
          return
        }

        if (statusCode === 404) {
          toast.error('Recent shares not loaded properly!', {
            position: 'bottom-right',
          })
          return
        }
      }

      if (recentShares?.length > 0 && successfullyFetchedRecentShares) {
        toast.success('Succesfully retrieved recent posts!', {
          autoClose: 1500,
          position: 'bottom-right',
        })
        return
      }

      if (recentShares?.length === 0) {
        toast.warning("You didn't share recently!", {
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
        Content shared with mental health experts
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
            <p>You haven't shared your content with anyone!</p>
          </section>
        )}

      {successfullyFetchedSharesPerMentalHealthExpert === false && (
        <section className="shares-per-mental-health-expert-content-main-container">
          <div className="shares-per-mental-health-expert-error-container">
            <BiError className="shares-per-mental-health-expert-error-icon" />
            <div className="shares-per-mental-health-expert-error-messages">
              <span className="shares-per-mental-health-expert-error-description">
                Posts couldn't be loaded!
              </span>
              <br />
              <span className="shares-per-mental-health-expert-error-description">
                If problem continues to happen, please contact support!
              </span>
            </div>
          </div>
        </section>
      )}
    </section>
  )
}
