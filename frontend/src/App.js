import React, { useState } from 'react';
import './App.css';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GroupPage from './components/page/Group/GroupPage';
import GroupViewPage from './components/page/Group/GroupViewPage';
import GroupCreatePage from './components/page/Group/GroupCreatePage';
import Layout from './Layout';
import UsedTrade from './components/pages/UsedTrade';
import UsedTradeView from './components/pages/UsedTradeView';

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
            <Route path="pages/used-trade" element={<UsedTrade />} />
            <Route path="pages/used-trade-view/:id" element={<UsedTradeView />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </AuthContext.Provider>
  );
};

export default App;
