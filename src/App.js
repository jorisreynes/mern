import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import GamesList from "./components/games-list.component";
import Login from "./components/login.component";
import UploadFile from "./components/upload-file.component";

function App() {
  return (
    <Router>
      {/* <div className="container"> */}
      <Navbar />
      <br />
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/upload" element={<UploadFile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {/* </div> */}
    </Router>
  );
}

export default App;
