import "react";
import MainUI from "../src/Pages/MainUI";
import SignUp from "../src/Pages/SignUp"
import Login from "./Pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Login/Main" element={<MainUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
