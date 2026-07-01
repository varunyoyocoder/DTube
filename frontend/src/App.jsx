import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset";
import Home from "./pages/Home";
import Profile from "./pages/Profile"
import CreateVideo from "./pages/CreateVideo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/forgot" element={<Forgot />} />
      <Route path="/password/reset" element={<Reset />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-video" element={<CreateVideo />} />
    </Routes>
  );
}

export default App;
