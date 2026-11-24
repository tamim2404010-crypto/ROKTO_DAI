import { Routes, Route } from "react-router-dom";

import Home from "./component/home.jsx";
import Login from "./component/login.jsx";
import Signup from "./component/signup.jsx";
import EmergencyRequest from "./component/emergency_request.jsx";
import VerifyEmail from "./component/verify_email.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/emergency-request" element={<EmergencyRequest />} />
    </Routes>
  );
}

export default App;