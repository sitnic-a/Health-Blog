import { ListOfPosts } from '../../components/ListOfPosts/ListOfPosts'
import { Navbar } from '../../components/shared/Navbar/Navbar'

import UserDashboardCSS from './UserDashboard.css'

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      <Navbar />
      <ListOfPosts />
    </section>
  )
}
