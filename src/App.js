import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComicStripGenerator from "./components/ComicStripGenerator";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ComicStripGenerator />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
