import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import UserManage from './pages/UserManage';
import DepartmentManage from './pages/DepartmentManage';
import ClassManage from './pages/ClassManage';
import RoleGuard from './components/RoleGuard';
import { isLoggedIn } from './utils/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="user" element={
              <RoleGuard roles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
                <UserManage />
              </RoleGuard>
            } />
            <Route path="department" element={
              <RoleGuard roles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
                <DepartmentManage />
              </RoleGuard>
            } />
            <Route path="class" element={
              <RoleGuard roles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
                <ClassManage />
              </RoleGuard>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
