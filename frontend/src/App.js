import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import GroupPage from "./components/page/Group/GroupPage";
import GroupViewPage from "./components/page/Group/GroupViewPage";
import GroupCreatePage from "./components/page/Group/GroupCreatePage";
import Layout from "./Layout";
import AlbaList from "./components/alba/AlbaList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <Routes>
          {/* 레이아웃을 사용하는 기본 경로 */}
          <Route element={<Layout />}>
            <Route index element={<h1>메인 페이지입니다</h1>} />
            {/* 그룹 관련 라우트 */}
            <Route path="group" element={<GroupPage />} />
            <Route path="group/view/:groupId" element={<GroupViewPage />} />
            <Route path="group/create" element={<GroupCreatePage />} />
            {/* 알바 페이지 */}
            <Route path="alba" element={<AlbaList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
