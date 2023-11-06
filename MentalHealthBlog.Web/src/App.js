//Main imports
import './App.css'
import { AddPost } from './components/AddPost'

//Import components
import { ListOfPosts } from './components/ListOfPosts'

function App() {
  return (
    <main>
      {/* <ListOfPosts /> */}
      <AddPost isOpen={true} />
    </main>
  )
}

export default App
