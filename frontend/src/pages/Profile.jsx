// import "../styles/Profile.css";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../assets/dtube-logo.png";
// import defaultUser from "../assets/user.png";
// import { useState } from "react";
// import api from "../services/api";

// function Me() {
//   const loggedIn = !!localStorage.getItem("accessToken");
//   const username = localStorage.getItem("username");
//   const storedProfileImage = localStorage.getItem("profileImage");

//   const navigate = useNavigate();

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const profileImage =
//     previewUrl ||
//     (storedProfileImage && storedProfileImage.trim() !== ""
//       ? storedProfileImage
//       : defaultUser);

//   const handleProfile = async (e) => {
//     const file = e.target.files[0];

//     if (!file) return ;

//     if (!file.type.startsWith("image/")) {
//       alert("Please select a valid image.");
//       return;
//     }

//     setSelectedImage(file);
//     setPreviewUrl(URL.createObjectURL(file));

//     const formData = new FormData();
//     formData.append("profileImage", file);

//     try {
//       const response = await api.patch(
//         "/channel/profilePicture",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.profileImage) {
//         localStorage.setItem(
//           "profileImage",
//           response.data.profileImage
//         );
//       }

//       alert(response.data.message);

//     } catch (err) {
//       console.log(err.response || err);
//       alert("Failed to update profile picture.");
//     }
//   };

//   return (
//     <div className="home">

//       {/* Navbar */}

//       <header className="navbar">
//         <Link to="/">
//           <div className="logo-section">
//             <img src={logo} alt="DTube" id="logo" />
//           </div>
//         </Link>

//         <div className="search-section">
//           <input
//             type="text"
//             placeholder="Search videos..."
//           />
//           <button>🔍</button>
//         </div>
//       </header>

//       {/* Body */}

//       <div className="content">

//         {/* Sidebar */}

//         <aside className="sidebar">
//           <ul>
//             <li>🏠 Home</li>
//             <li>📺 Subscriptions</li>
//             <li>🔥 Trending</li>
//             <li>🕘 History</li>
//             <li>📚 Library</li>
//             <li>👍 Liked Videos</li>
//           </ul>
//         </aside>

//         {/* Main */}

//         <main
//           style={{
//             marginLeft: "260px",
//             padding: "40px",
//             color: "white",
//           }}
//         >
//           <h1>My Profile</h1>

//           <div
//             style={{
//               marginTop: "30px",
//               background: "#1f1f1f",
//               padding: "30px",
//               borderRadius: "12px",
//               width: "400px",
//               textAlign: "center",
//             }}
//           >
//             <img
//               src={profileImage}
//               alt="Profile"
//               style={{
//                 width: "150px",
//                 height: "150px",
//                 borderRadius: "50%",
//                 backgroundColor:"white",
//                 objectFit: "cover",
//                 cursor: "pointer",
//               }}
//               onClick={() =>
//                 document.getElementById("profileInput").click()
//               }
//             />

//             <input
//               id="profileInput"
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleProfile}
//             />

//             <h2>{username}</h2>

//             <button 
//               onClick={() =>
//                 document.getElementById("profileInput").click()
//               }
//             >
//               Change Profile Picture
//             </button>
//           </div>
//         </main>

//       </div>
//     </div>
//   );
// }

// export default Me;