import { Outlet } from "react-router-dom";
import Toolbar from "./ui/Toolbar";
import styled from "styled-components";
import Footer from "./ui/Footer";

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
  return (
    <Container>
      <Toolbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>

  );
}