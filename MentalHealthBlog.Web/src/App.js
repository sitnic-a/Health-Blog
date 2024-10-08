import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Main imports
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Import components
import { ListOfPosts } from "./components/ListOfPosts";
import { PostById } from "./components/PostById";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Loader } from "./components/Loader";

import { store } from "./components/redux-toolkit/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route path="/" element={<ListOfPosts />} />
            <Route path="/post/:id" element={<PostById />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
          <ToastContainer />
        </main>
      </Router>
    </Provider>
  );
}

export default App;
