import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Main imports
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Import components
import { PostById } from "./components/PostById";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

import { store } from "./components/redux-toolkit/store";
import { Provider } from "react-redux";
import { Dashboard } from "./pages/Dashboard";
import { SharedPosts } from "./components/SharedPosts";
import { Requests } from "./components/administrator-dashboard/sections/requests/Requests";
import { NewExperts } from "./components/administrator-dashboard/sections/requests/NewExperts";
import { ManageUsers } from "./components/administrator-dashboard/sections/manage-users/ManageUsers";
import { SharedContentPermission } from "./components/SharedContentPermission";
import { SharedContentPostsViaLink } from "./components/SharedContentPostsViaLink";
import { RequireAuth } from "./components/RequireAuth";
import { CreateAssignment } from "./components/mental-expert-dashboard/shared-content/CreateAssignment";
import { windowResize } from "./components/utils/helper-methods/methods";
import { application } from "./application";
import { ReviewAssignmentsButton } from "./components/shared/ReviewAssignmentsButton";
import { Assignments } from "./components/shared/Assignments";

function App() {
  windowResize(application.layouts.min_screen_single_col_width);

  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/register" element={<Register />}></Route>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/post/:id" element={<PostById />}></Route>
              <Route path="/shared-posts" element={<SharedPosts />}></Route>
              <Route
                path="shared-content-permission"
                element={<SharedContentPermission />}
              ></Route>

              <Route
                path="/share/link/:shareGuid"
                element={<SharedContentPostsViaLink />}
              ></Route>
              <Route path="/requests" element={<Requests />}></Route>
              <Route path="/manage-users" element={<ManageUsers />}></Route>
              <Route
                path="/requests/new-experts"
                element={<NewExperts />}
              ></Route>
              <Route path="/create-assignment" element={<CreateAssignment />} />
              <Route path="/assignments/user/:id" element={<Assignments />} />
            </Route>
          </Routes>
          <ToastContainer />
        </main>
      </Router>
    </Provider>
  );
}

export default App;
