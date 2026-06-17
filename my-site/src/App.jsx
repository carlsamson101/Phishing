// Swap BrowserRouter with HashRouter
import { HashRouter, Routes, Route } from "react-router-dom";

// Import your components with matching names
import Signin from "./Signin";
import Counter from "./Counter";

function App() {
  return (
    <HashRouter>
      {/* The navigation bar has been removed from here 
        so it won't distort the login page layout.
      */}
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </HashRouter>
  );
}

export default App;