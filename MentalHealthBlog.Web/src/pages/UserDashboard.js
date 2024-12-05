import { Link } from 'react-router-dom'
import { ListOfPosts } from '../components/ListOfPosts'

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul className="navbar-list">
            <li>
              <Link
                to={'shared-content'}
                className="navbar-action-shared-content"
              >
                Shared Content
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  )
}
