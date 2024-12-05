import { Link } from 'react-router-dom'
import { ListOfPosts } from '../components/ListOfPosts'

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      {/* Navigation bar */}
      <section className="navigation-container">
        <div className="navbar">
          <ul>
            <Link to={'shared-content'}>
              <li>Shared Content</li>
            </Link>
          </ul>
        </div>
      </section>
      <ListOfPosts />
    </section>
  )
}
