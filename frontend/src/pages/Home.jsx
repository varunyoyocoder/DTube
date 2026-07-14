import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import Album from "../components/Album";
import Layout from "../components/Layout";

function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";
  const endpoint =
  search && search.trim() !== ""
    ? `/videos/search?query=${encodeURIComponent(search)}`
    : "/videos";
  return (
    <Layout>
      <Album
        fetchVideos={true}
        endpoint={endpoint}
        isAdmin={isAdmin}
      />
    </Layout>
  );
}

export default Home;