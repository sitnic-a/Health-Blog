import { ListOfPosts } from '../components/ListOfPosts'
import { useSelector } from 'react-redux'

export const Dashboard = () => {
  let { authenticatedUser } = useSelector((store) => store.user)
  console.log('Dashboard logged user ', authenticatedUser)

  if (authenticatedUser !== null) {
    if (authenticatedUser.userRoles.some((ur) => ur.name === 'User')) {
      return <ListOfPosts />
    }
    if (authenticatedUser.userRoles.some((ur) => ur.name === 'Administrator')) {
      return <p>Admin page</p>
    }
    if (
      authenticatedUser.userRoles.some(
        (ur) => ur.name === 'Psychologist/Psychotherapist'
      )
    ) {
      return <p>Psychologist page</p>
    }
  }
  return <p>ERROR</p>
}
