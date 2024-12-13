import { Outlet } from "react-router-dom";
import Toolbar from "./ui/Toolbar";
import styled from "styled-components";
import Footer from "./ui/Footer";
import { useEffect, useState } from "react";

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

  return (
    <Container>
      <Toolbar scrolled={scrolled} />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>

  );
}