import './App.css';
import Layout from './Layout';
import React, { useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GroupPage from './components/page/Group/GroupPage';
import GroupViewPage from './components/page/Group/GroupViewPage';
import GroupCreatePage from './components/page/Group/GroupCreatePage';

import UsedTrade from './components/pages/UsedTrade';
import UsedTradeView from './components/pages/UsedTradeView';

import AlbaList from './components/alba/AlbaList';
import AlbaCreate from "./components/alba/AlbaCreate";
import AlbaDetail from "./components/alba/AlbaDetail";
import AlbaEdit from "./components/alba/AlbaEdit";


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
            <Route path="/alba/create" element={<AlbaCreate />} />
            <Route path="/alba/:id" element={<AlbaDetail />} />
            <Route path="/alba/:id/edit" element={<AlbaEdit />} />

            <Route path="pages/used-trade" element={<UsedTrade />} />
            <Route path="pages/used-trade-view/:id" element={<UsedTradeView />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </AuthContext.Provider>
  );
};

export default App;
