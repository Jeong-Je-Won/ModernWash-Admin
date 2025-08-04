import './App.css';
import Header from './components/common/Header';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Index from './components/Index';
import NoticeList from './components/notice/NoticeList';
import AddNotice from './components/notice/AddNotice';
import FAQAdminList from './components/faq/FAQAdminList';
import NoticeDetail from './components/notice/NoticeDetail';
import EditNotice from './components/notice/EditNotice';
import AddFAQ from './components/faq/AddFAQ';
import EditFAQ from './components/faq/EditFAQ';
import FAQDetail from './components/faq/FAQDetail';
import FAQUserList from './components/faq/FAQUserList';
import MemberList from './components/members/MemberList';
import MemberVehicles from './components/members/MemberVehicles';
import BannerList from './components/banners/BannerList';
import SubscriptionsList from './components/subscriptions/SubscriptionsList';

function App() {

  return (
    <div className="App" style={{ userSelect: 'none' }}>
      <Header />
      <div style={{ display: 'flex', marginTop: '64px' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/admin/notices" element={<NoticeList />} />
            <Route path="/admin/notices/:id" element={<NoticeDetail />} />
            <Route path="/admin/add-notice" element={<AddNotice />} />
            <Route path="/admin/notices/:id/edit" element={<EditNotice />} />
            <Route path="/faqs" element={<FAQUserList />} />
            <Route path="/admin/faqs" element={<FAQAdminList />} />
            <Route path="/admin/faqs/:id" element={<FAQDetail />} />
            <Route path="/admin/add-faq" element={<AddFAQ />} />
            <Route path="/admin/faqs/:id/edit" element={<EditFAQ />} />
            <Route path="/admin/members" element={<MemberList />} />
            <Route path="/admin/members/:memberId/vehicles" element={<MemberVehicles />} />
            <Route path="/admin/banners" element={<BannerList />} />
            <Route path="/admin/subscriptions" element={<SubscriptionsList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
