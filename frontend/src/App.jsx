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
import PublicRoute  from "./services/protectingRoutes";
import AdminRoute from "./services/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}/>
      <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
      <Route path="/password/forgot" element={<PublicRoute><Forgot/></PublicRoute>}/>
      <Route path="/password/reset" element={<PublicRoute><Reset/></PublicRoute>}/>
      <Route path="/channel/:channelId" element={<Channel />} />
      <Route path="/create-video" element={<CreateVideo />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Admin/></AdminRoute>} />
      <Route path="/history" element={<History/>} />
      <Route path="/likedVideos" element={<LikedVideos/>} />
      <Route path="/subscription" element={<Subscription/>} />
    </Routes>
  );
}

export default App;
