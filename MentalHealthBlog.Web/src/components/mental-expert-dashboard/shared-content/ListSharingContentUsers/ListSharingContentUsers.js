import { useDispatch, useSelector } from 'react-redux'
import {
  getSharedContentOfPickedUser,
  setOverlayPost,
} from '../../../../redux-toolkit/features/mentalExpertSlice'
import { expandShrinkSidebar } from '../../../../utils/helper-methods/methods'

import { BiExpandAlt } from 'react-icons/bi'
import { getUserById } from '../../../../redux-toolkit/features/userSlice'

import ListSharingContentUsersCSS from './ListSharingContentUsers.css'

export const ListSharingContentUsers = () => {
  let dispatch = useDispatch()

  let { usersThatSharedIncludingItsContent, usersThatSharedContent } =
    useSelector((store) => store.mentalExpert)

  return (
    <section className="sharing-users-main-users-container">
      <div className="sharing-users-expander-action">
        <span
          className="sharing-users-expander-icon"
          onClick={() => {
            expandShrinkSidebar()
          }}
        >
          <BiExpandAlt />
        </span>
      </div>
      <div className="sharing-users-users-container">
        {usersThatSharedContent?.length > 0 &&
          usersThatSharedContent?.map((user) => {
            return (
              <div
                className="sharing-user-user-container"
                key={user?.id}
                onClick={() => {
                  if (window.screen.width <= 550) {
                    expandShrinkSidebar()
                    let contentAndQuery = {
                      userId: user?.id,
                      usersThatSharedIncludingItsContent,
                    }
                    dispatch(getSharedContentOfPickedUser(contentAndQuery))
                    dispatch(setOverlayPost(null))
                    dispatch(getUserById(user.id))
                  }
                  let contentAndQuery = {
                    userId: user?.id,
                    usersThatSharedIncludingItsContent,
                  }
                  dispatch(getSharedContentOfPickedUser(contentAndQuery))
                  dispatch(setOverlayPost(null))
                  dispatch(getUserById(user.id))
                }}
              >
                <span className="sharing-user-title">{user?.username}</span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
