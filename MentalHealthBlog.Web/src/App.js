import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//Main imports
import './App.css'
import './components/shared/shared.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Import components
import { PostById } from './components/PostById'
import { Login } from './components/Login/Login'
import { Register } from './components/Register/Register'

import { store } from './redux-toolkit/store'
import { Provider } from 'react-redux'
import { Dashboard } from './pages/Dashboard'
import { SharedPosts } from './components/SharedPosts'
import { NewExperts } from './components/administrator-dashboard/sections/requests/NewExperts/NewExperts'
import { ManageUsers } from './components/administrator-dashboard/sections/manage-users/ManageUsers/ManageUsers'
import { SharedContentPermission } from './components/SharedContentPermission/SharedContentPermission'
import { SharedContentPostsViaLink } from './components/SharedContentPostsViaLink'
import { RequireAuth } from './components/RequireAuth'
import { CreateAssignment } from './components/mental-expert-dashboard/shared-content/CreateAssignment'
import { windowResize } from './utils/helper-methods/methods'
import { application } from './application'
import { Assignments } from './components/shared/Assignments'
import { NotFound } from './pages/exceptions/NotFound/NotFound'

function App() {
  windowResize(application.layouts.min_screen_single_col_width)

  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/register" element={<Register />}></Route>
            <Route
              path="/share/link/:shareGuid"
              element={<SharedContentPostsViaLink />}
            ></Route>

            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/post/:id" element={<PostById />}></Route>

              <Route path="/shared-posts" element={<SharedPosts />}></Route>
              <Route
                path="shared-content-permission"
                element={<SharedContentPermission />}
              ></Route>

              <Route path="/manage-users" element={<ManageUsers />}></Route>
              <Route
                path="/requests/new-experts"
                element={<NewExperts />}
              ></Route>
              <Route path="/create-assignment" element={<CreateAssignment />} />
              <Route path="/assignments/user/:id" element={<Assignments />} />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </main>
      </Router>
    </Provider>
  )
}

export default App
