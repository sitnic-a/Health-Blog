import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOnlyUsersThatSharedContent,
  getSharesPerUser,
} from '../components/redux-toolkit/features/mentalExpertSlice'
import { toast } from 'react-toastify'
import { ListSharingContentUsers } from '../components/mental-expert-dashboard/shared-content/ListSharingContentUsers'
import { ListSharedContent } from '../components/mental-expert-dashboard/shared-content/ListSharedContent'
import { Logout } from '../components/shared/Logout'
import { ReviewAssignmentsButton } from '../components/shared/ReviewAssignmentsButton'
import { Navbar } from '../components/shared/Navbar'

export const MentalExpertDashboard = () => {
  let dispatch = useDispatch()
  let { sharedContent, usersThatSharedIncludingItsContent } = useSelector(
    (store) => store.mentalExpert
  )
  let { authenticatedUser } = useSelector((store) => store.user)

  let objectWithData = {
    query: {
      loggedExpertId: authenticatedUser.id,
    },
    authenticatedUser,
  }

  useEffect(() => {
    dispatch(getSharesPerUser(objectWithData)).then((data) => {
      let statusCode = data?.payload?.StatusCode

      if (statusCode !== 200) {
        if (statusCode === 400) {
          toast.error("Fetching shares wasn't possible!", {
            position: 'bottom-right',
          })
          return
        }
        if (statusCode === 404) {
          toast.error("Couldn't fetch shares properly!", {
            position: 'bottom-right',
          })
          return
        }
      }
      console.log('Data ', data.payload)

      if (data?.payload.serviceResponseObject?.length === 0) {
        toast.warning('Nothing shared so far!', {
          position: 'bottom-right',
        })
      }

      if (data?.payload.serviceResponseObject?.length > 0) {
        toast.success('Succesfully retrieved content!', {
          position: 'bottom-right',
        })
      }

      dispatch(getOnlyUsersThatSharedContent(data))
    })
  }, [])

  return (
    <section className="mental-expert-dashboard">
      <Navbar />

      <section id="sharing-users-main-container">
        <ListSharingContentUsers />

        {usersThatSharedIncludingItsContent?.length === 0 && (
          <div className="sharing-users-main-content-container">
            <div className="sharing-users-main-content-info">
              <p>Nothing shared</p>
            </div>
          </div>
        )}

        {usersThatSharedIncludingItsContent?.length > 0 &&
          sharedContent?.length === 0 && (
            <div className="sharing-users-main-content-container">
              <div className="sharing-users-main-content-info">
                <p>
                  <span>NOTE: </span>If you want to review users content, pick a
                  user by clicking arrows icon and then user box or simply user
                  box!
                </p>
              </div>
            </div>
          )}

        {sharedContent?.length > 0 && (
          <ListSharedContent sharedContent={[...sharedContent]} />
        )}
      </section>
    </section>
  )
}
