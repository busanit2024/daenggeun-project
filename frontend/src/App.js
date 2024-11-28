import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GroupPage from './components/page/Group/GroupPage';
import GroupViewPage from './components/page/Group/GroupViewPage';
import GroupCreatePage from './components/page/Group/GroupCreatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<h1>메인 페이지입니다</h1>} />
        <Route path="group" element={<GroupPage />} />
        <Route path="group/view/:groupId" element={<GroupViewPage />} />
        <Route path="group/create" element={<GroupCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
