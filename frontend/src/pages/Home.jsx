import Album from "../components/Album";
import Layout from "../components/Layout";

function Home() {
  return (
    <Layout>
      <Album fetchVideos={true} endpoint="/videos" />
    </Layout>
  );
}

export default Home;