// import "../styles/Profile.css";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/dtube-logo.png";
// import defaultUser from "../assets/user.png";
// import { useState, useEffect } from "react";
// import api from "../services/api";
// import Album from "../components/Album";
// import { Button } from "react-bootstrap";
// import Layout from "../components/Layout";

// function Profile() {
//   const loggedIn = !!localStorage.getItem("accessToken");
//   const username = localStorage.getItem("username");
//   const [videos, setVideos] = useState(null);
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await api.get(
//           "/videos/channel/" + localStorage.getItem("userId"),
//         );
//         console.log("Fetched videos:", response.data);
//         setVideos(response.data);
//       } catch (err) {
//         console.error("Failed to fetch videos:", err);
//       }
//     };
//     fetchVideos();
//   }, []);
//   const navigate = useNavigate();
//   const [profileImage, setProfileImage] = useState(
//     localStorage.getItem("profileImage") || defaultUser,
//   );
//   const handleProfile = async (e) => {
//     if (userId.equals()) {
//       return;
//     }
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       alert("Please select a valid image.");
//       return;
//     }
//     setProfileImage(URL.createObjectURL(file));
//     const formData = new FormData();
//     formData.append("profileImage", file);
//     try {
//       const response = await api.patch(
//         "/channel/changeProfilePicture",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       const imageURL = response.data.profileImageURL;
//       localStorage.setItem("profileImage", imageURL);
//       setProfileImage(imageURL);
//       alert(response.data.message);
//     } catch (err) {
//       console.log(err.response || err);
//       alert("Failed to update profile picture.");
//     }
//   };
//   const removeProfile = async (e) => {
//     try {
//       const response = await api.patch("/channel/removeProfilePicture");
//       localStorage.removeItem("profileImage");
//       setProfileImage(defaultUser);
//       alert(response.data.message);
//     } catch (err) {
//       console.log(err.response || err);
//     }
//   };
//   const createVideo = async (e) => {
//     try {
//       const response = await api.post("/channel/createVideo");
//       alert(response.data.message);
//     } catch (err) {
//       console.log(err.response || err);
//     }
//   };
//   return (
//     <Layout>
//       <main className="profile-main">
//         <h1 className="profile-title">My Profile</h1>
//         <div className="profile-card">
//           <img
//             src={profileImage}
//             className="profile-image"
//             onClick={() => document.getElementById("profileInput").click()}
//           />
//           <input
//             id="profileInput"
//             hidden
//             type="file"
//             accept="image/*"
//             onChange={handleProfile}
//           />
//           <div className="profile-details">
//             <h2 className="profile-name">{username}</h2>
//             <h5>{videos?.length || 0} Videos</h5>
//             <div className="profile-buttons">
//               <button
//                 className="profile-btn"
//                 onClick={() => document.getElementById("profileInput").click()}
//               >
//                 Change Picture
//               </button>
//               <button className="profile-btn" onClick={removeProfile}>
//                 Remove Picture
//               </button>
//               <Link to="/create-video">
//                 <button className="profile-btn">Upload Video</button>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="video-section">
//           <h2 className="video-title">Your Videos</h2>
//           <Album cardsArray={videos} fetchVideos={false} />
//         </div>
//       </main>
//     </Layout>
//   );
// }

// export default Profile;
