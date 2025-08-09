import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ImageReveal from "./component/ImageReveal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageReveal />} />
        <Route path="/about" element={<div>about</div>} />
      </Routes>
    </Router>
  );
}

export default App;
