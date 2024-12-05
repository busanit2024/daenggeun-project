import { Outlet, useParams } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Main = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 80px 0;
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