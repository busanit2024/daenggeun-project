import { Outlet, useNavigate } from "react-router-dom";
import Toolbar from "./ui/Toolbar";
import styled from "styled-components";
import Footer from "./ui/Footer";
import { useEffect, useState } from "react";
import SearchBar from "./ui/SearchBar";
import { useArea } from "../context/AreaContext";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Main = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 0 64px;
  margin: 100px 0;
`;

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { area, setArea } = useArea();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }
  , []);

  useEffect(() => {    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search');
    if (!searchQuery) {
      setSearchTerm("");
    }

    if (location.pathname.includes("community")) {
      setSelectedCategory("동네생활");
    } else if (location.pathname.includes("alba")) {
      setSelectedCategory("알바");
    } else {
      setSelectedCategory("중고거래");
    }
  }, [location.pathname, location.search]);

  const handleLocationSelect = (selectedLocation) => {
    const [sigungu, emd] = selectedLocation.split(",").map(loc => loc.trim());
    setArea({ sigungu, emd });
  };

  const onSearch = (searchTerm) => {
    if (selectedCategory) {
      if (selectedCategory === "중고거래") {
        navigate(`/usedTrade?search=${searchTerm}`);
      } else if (selectedCategory === "알바") {
        navigate(`/alba?search=${searchTerm}`);
      } else if (selectedCategory === "동네생활") {
        navigate(`/community?search=${searchTerm}`);
    }
  };
}

  return (
    <Container>
      <Toolbar scrolled={scrolled} />
      <Main>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelect={handleLocationSelect}
        onSearch={onSearch} />
        <Outlet />
      </Main>
      <Footer />
    </Container>

  );
}