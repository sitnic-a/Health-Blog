import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ListOfPosts } from '../components/ListOfPosts'
import { Logout } from '../components/shared/Logout'
import { ReviewAssignmentsButton } from '../components/shared/ReviewAssignmentsButton'

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul className="navbar-list">
            <div className="left">
              <li>
                <Link
                  to={'shared-posts'}
                  className="navbar-action-shared-content"
                >
                  Shared Content
                </Link>
              </li>
              <ReviewAssignmentsButton />
            </div>

            <Logout />
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  )
}
