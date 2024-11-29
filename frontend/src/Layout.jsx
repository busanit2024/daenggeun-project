import { Outlet } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Main = styled.div`
  width: 1024px;
  padding: 0 128px;
  margin: 80px auto;
`;

export default function Layout() {
  return (
    <Container>
      <Toolbar />
      <Main>
        <Outlet />
      </Main>
    </Container>

  );
}