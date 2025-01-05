import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//Main imports
import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Import components
import { PostById } from './components/PostById'
import { Login } from './components/Login'
import { Register } from './components/Register'

import { store } from './components/redux-toolkit/store'
import { Provider } from 'react-redux'
import { Dashboard } from './pages/Dashboard'
import { SharedPosts } from './components/SharedPosts'
import { Requests } from './components/administrator-dashboard/sections/requests/Requests'
import { ApproveMentalHealthExpert } from './components/administrator-dashboard/sections/requests/ApproveMentalHealthExpert'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/post/:id" element={<PostById />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/shared-content" element={<SharedPosts />}></Route>
            <Route
              path="/share/link/:shareGuid"
              element={<SharedPosts />}
            ></Route>
            <Route path="/requests" element={<Requests />}></Route>
            <Route
              path="/requests/new-experts"
              element={<ApproveMentalHealthExpert />}
            ></Route>
          </Routes>
          <ToastContainer />
        </main>
      </Router>
    </Provider>
  )
}

export default App
