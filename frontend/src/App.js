import React, { useState } from 'react';
import './App.css';
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

import AlbaPage from './components/alba/AlbaPage';
import AlbaList from './components/alba/AlbaList';
import GroupEditPage from './components/pages/Group/GroupEditPage';
import LoginPage from './components/pages/Login/LoginPage';
import MainPage from './components/pages/MainPage';
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
            <Route path="/" element={<MainPage />} />
            <Route path="group" element={<GroupPage />} />
            <Route path="group/view/:groupId" element={<GroupViewPage />} />
            <Route path="group/create" element={<GroupCreatePage />} />
            <Route path="group/edit/:groupId" element={<GroupEditPage />} />

            <Route path="alba" element={<AlbaPage />} />
            <Route path="alba/create" element={<AlbaCreate />} />
            <Route path="alba/:id" element={<AlbaDetail />} />
            <Route path="alba/:id/edit" element={<AlbaEdit />} />

            <Route path="usedTrade/used-trade" element={<UsedTrade />} />
            <Route path="usedTrade/used-trade-view/:id" element={<UsedTradeView />} />
            <Route path="usedTrade/used-trade-write" element={<UsedTradeWrite />} />
            <Route path="usedTrade/used-trade-update/:id" element={<UsedTradeUpdate />} />
            <Route path="Login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </AuthContext.Provider>
  );
};

export default App;
