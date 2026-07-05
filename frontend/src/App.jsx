import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset";
import Home from "./pages/Home";
import Channel from "./pages/Channel"
import CreateVideo from "./pages/CreateVideo";
import Watch from "./pages/Watch";
import Admin from "./pages/Admin";
import Subscription from "./pages/Subscription";
import History from "./pages/History";
import LikedVideos from"./pages/Liked";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password/forgot" element={<Forgot />} />
      <Route path="/password/reset" element={<Reset />} />
      <Route path="/channel/:channelId" element={<Channel />} />
      <Route path="/create-video" element={<CreateVideo />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="/admin/dashboard" element={<Admin/>} />
      <Route path="/history" element={<History/>} />
      <Route path="/likedVideos" element={<LikedVideos/>} />
      <Route path="/subscription" element={<Subscription/>} />
    </Routes>
  );
}

export default App;
