import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useFetchLocationState from '../../custom/hooks/useFetchLocationState'
import {
  getSharesPerMentalHealthExpert,
  setIsReviewingState,
} from '../../redux-toolkit/features/regularUserSlice'

import { Post } from '../Post/Post'

import SharedContentPermissionPostsCSS from './SharedContentPermissionPosts.css'

export const SharedContentPermissionPosts = () => {
  let dispatch = useDispatch()
  // let { authenticatedUser } = useSelector((store) => store.user)

  let authenticatedUserLocalStorage = localStorage.getItem('authenticatedUser')
  let authenticatedUser = JSON.parse(authenticatedUserLocalStorage)

  let { sharesPerMentalHealthExpert } = useSelector(
    (store) => store.regularUser
  )

  let { mentalHealthExpert, isReviewingSharedContent } = useFetchLocationState()

  let contentSharedWithMentalHealthExpert = sharesPerMentalHealthExpert?.filter(
    (mhe) =>
      mhe?.mentalHealthExpertContentSharedWith?.id === mentalHealthExpert?.id
  )

  useEffect(() => {
    dispatch(setIsReviewingState(isReviewingSharedContent))
    let objectWithData = {
      query: {
        loggedUserId: authenticatedUser?.id,
      },
      authenticatedUser,
    }
    dispatch(getSharesPerMentalHealthExpert(objectWithData))
  }, [])

  return (
    <>
      {contentSharedWithMentalHealthExpert[0]?.sharedContent?.length > 0 && (
        <div className="content-shared-with-mental-health-expert-posts">
          {contentSharedWithMentalHealthExpert[0]?.sharedContent?.map(
            (post) => {
              return (
                <Post
                  key={post?.id}
                  post={post}
                  sharedWith={mentalHealthExpert}
                />
              )
            }
          )}
        </div>
      )}
      {contentSharedWithMentalHealthExpert?.length <= 0 && (
        <div className="content-shared-with-mental-health-expert-posts">
          <p className="content-shared-with-mental-health-expert-description">
            Ništa od Vašeg sadržaja nije dijeljeno sa stručnjacima za mentalno
            zdravlje!
          </p>
        </div>
      )}
    </>
  )
}
