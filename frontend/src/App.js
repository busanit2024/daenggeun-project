import React, { useState } from 'react';
import './App.css';
import axios from "axios";
import Toolbar from './components/Toolbar';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GroupPage from './components/pages/Group/GroupPage';
import GroupViewPage from './components/pages/Group/GroupViewPage';
import GroupCreatePage from './components/pages/Group/GroupCreatePage';
import Layout from './Layout';
import UsedTrade from './components/pages/UsedTrade/UsedTrade';
import UsedTradeView from './components/pages/UsedTrade/UsedTradeView';
import UsedTradeWrite from './components/pages/UsedTrade/UsedTradeWrite';
import UsedTradeUpdate from './components/pages/UsedTrade/UsedTradeUpdate';
import AlbaList from './components/alba/AlbaList';
import CommunityPage from './components/pages/Community/CommunityPage';
// import CommunityViewPage from './components/pages/Community/CommunityViewPage';
import CommunityWritePage from './components/pages/Community/CommunityWritePage'; // 수정된 경로

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<h1>메인 페이지입니다</h1>} />
            <Route path="group" element={<GroupPage />} />
            <Route path="group/view/:groupId" element={<GroupViewPage />} />
            <Route path="group/create" element={<GroupCreatePage />} />
            <Route path="alba" element={<AlbaList />} />
            <Route path="usedTrade/used-trade" element={<UsedTrade />} />
            <Route path="usedTrade/used-trade-view/:id" element={<UsedTradeView />} />
            <Route path="community" element={<CommunityPage />} />
            {/* <Route path="community/view/:communityId" element={<CommunityViewPage />} /> */}
            <Route path="community/write" element={<CommunityWritePage />} />
            <Route path="usedTrade/used-trade-write" element={<UsedTradeWrite />} />
            <Route path="usedTrade/used-trade-update/:id" element={<UsedTradeUpdate />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </AuthContext.Provider>
  );
};

export default App;
