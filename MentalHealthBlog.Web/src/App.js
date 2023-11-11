import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Main imports
import "./App.css";

//Import components
import { ListOfPosts } from "./components/ListOfPosts";
import { PostById } from "./components/PostById";
import { Login } from "./components/Login";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/" element={<ListOfPosts />} />
          <Route path="/post/:id" element={<PostById />}></Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
