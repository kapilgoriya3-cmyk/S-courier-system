import {  Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddEntry from "./pages/AddEntry";
import Records from "./pages/Records";
import Billing from "./pages/Billing";
import { BrowserRouter  } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<AddEntry />} />
        <Route path="/records" element={<Records />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
