import "react";
import MainUI from "../src/MainUI";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
