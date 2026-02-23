import {  Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddEntry from "./pages/AddEntry";
import Records from "./pages/Records";
import Billing from "./pages/Billing";
import { HashRouter  } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");

if (!token) {
  return <Login />;
}
  return (


    <HashRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<AddEntry />} />
        <Route path="/records" element={<Records />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
