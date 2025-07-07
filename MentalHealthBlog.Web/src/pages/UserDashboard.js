import { ListOfPosts } from '../components/ListOfPosts'
import { Navbar } from '../components/shared/Navbar'

export const UserDashboard = () => {
  return (
    <section className="user-dashboard">
      <Navbar />
      <ListOfPosts />
    </section>
  )
}
