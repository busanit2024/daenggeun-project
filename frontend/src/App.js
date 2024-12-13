import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

import GroupPage from './components/pages/Group/GroupPage';
import GroupViewPage from './components/pages/Group/GroupViewPage';
import GroupCreatePage from './components/pages/Group/GroupCreatePage';
import GroupEditPage from './components/pages/Group/GroupEditPage';

import UsedTrade from './components/pages/UsedTrade/UsedTrade';
import UsedTradeView from './components/pages/UsedTrade/UsedTradeView';
import UsedTradeWrite from './components/pages/UsedTrade/UsedTradeWrite';
import UsedTradeUpdate from './components/pages/UsedTrade/UsedTradeUpdate';

import CommunityPage from './components/pages/Community/CommunityPage';
import CommunityViewPage from './components/pages/Community/CommunityViewPage';
import CommunityWritePage from './components/pages/Community/CommunityWritePage';
import CommunityEditPage from './components/pages/Community/CommunityEditPage';

import LoginPage from './components/pages/Login/LoginPage';
import MainPage from './components/pages/MainPage';

import AlbaPage from './components/pages/Alba/AlbaPage';
import AlbaCreate from "./components/pages/Alba/AlbaCreate";
import AlbaDetail from "./components/pages/Alba/AlbaDetail";
import AlbaEdit from "./components/pages/Alba/AlbaEdit";

import GroupView from './components/group/GroupView';
import GroupMembers from './components/group/GroupMembers';
import GroupSchedules from './components/group/GroupSchedules';
import GroupBoard from './components/group/GroupBoard';
import MemberProfile from './components/group/MemberProfile';
import SetProfilePage from './components/pages/Login/SetProfilePage';
import JoinRequest from './components/group/JoinRequest';
import GroupAlbum from './components/group/GroupAlbum';
import GroupBoardWrite from './components/group/GroupBoardWrite';
import { AreaProvider } from './context/AreaContext';
import GroupBoardView from './components/group/GroupBoardView';
import MyPageMain from './components/pages/Mypage/MyPageMain';
import MyProfileEdit from './components/pages/Mypage/MyProfileEdit';
import MyCommunity from './components/mypage/MyCommunity';
import MyLocation from './components/mypage/MyLocation';
import MyTrade from './components/mypage/MyTrade';
import MyGroup from './components/mypage/MyGroup';
import MyPageList from './components/mypage/MyPageList';
import GroupScheduleWrite from './components/group/GroupScheduleWrite';
import GroupScheduleView from './components/group/GroupScheduleView';


function App() {
  return (
    <AuthProvider>
      <AreaProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />

              <Route path="group" element={<GroupPage />} />
              <Route path="group/:groupId" element={<GroupViewPage />}>
                <Route path="" element={<GroupView />} />
                <Route path="members" element={<GroupMembers />} />
                <Route path='members/:memberId' element={<MemberProfile />} />
                <Route path="my" element={<MemberProfile />} />
                <Route path="schedule" element={<GroupSchedules />} />
                <Route path="board" element={<GroupBoard />} />
                <Route path='board/write' element={<GroupBoardWrite />} />
                <Route path='board/:postId' element={<GroupBoardView />} />
                <Route path='board/:postId/edit' element={<GroupBoardWrite />} />
                <Route path='schedule/write' element={<GroupScheduleWrite />} />
                <Route path='schedule/:postId' element={<GroupScheduleView />} />
                <Route path='schedule/:postId/edit' element={<GroupScheduleWrite />} />
                <Route path="requests" element={<JoinRequest />} />
                <Route path='album' element={<GroupAlbum />} />
              </Route>
              <Route path="group/create" element={<GroupCreatePage />} />
              <Route path="group/:groupId/edit" element={<GroupEditPage />} />

              <Route path="alba" element={<AlbaPage />} />
              <Route path="alba/create" element={<AlbaCreate />} />
              <Route path="alba/:id" element={<AlbaDetail />} />
              <Route path="alba/:id/edit" element={<AlbaEdit />} />

              <Route path="usedTrade" element={<UsedTrade />} />
              <Route path="usedTradeView/:id" element={<UsedTradeView />} />
              <Route path="usedTradeWrite" element={<UsedTradeWrite />} />
              <Route path="usedTradeUpdate/:id" element={<UsedTradeUpdate />} />
              <Route path="login" element={<LoginPage />} />

            <Route path="community" element={<CommunityPage />} />
            <Route path="community/write" element={<CommunityWritePage />} />
            <Route path="community/:communityId" element={<CommunityViewPage />} />
            <Route path="communityEdit/:communityId" element={<CommunityEditPage />} />

            <Route path='mypage' element={<MyPageMain />} >
              <Route path="" element={<MyPageList />} />
              <Route path='community' element={<MyCommunity />} />
              <Route path='location' element={<MyLocation />} />
              <Route path='trade' element={<MyTrade />} />
              <Route path='group' element={<MyGroup />} />
            </Route>
              <Route path='mypage/edit' element={<MyProfileEdit />} />
              <Route path="setProfile/:userId" element={<SetProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </AreaProvider>
    </AuthProvider>
  );
};

export default App;
