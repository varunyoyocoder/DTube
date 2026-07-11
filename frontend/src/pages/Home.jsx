import Album from "../components/Album";
import Layout from "../components/Layout";

function Home() {
  const userRole=localStorage.getItem("userRole");
    const isAdmin= userRole==="admin";
  return (
    <Layout>
      <Album fetchVideos={true} endpoint="/videos" isAdmin={isAdmin}/>
    </Layout>
  );
}

export default Home;