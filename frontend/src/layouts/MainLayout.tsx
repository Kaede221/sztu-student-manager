import { useState } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  BookOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ReadOutlined,
  FormOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUsername, getRole, removeToken } from '../utils/auth';

const { Header, Sider, Content } = Layout;

const allMenuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页', roles: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'] },
  { key: '/user', icon: <UserOutlined />, label: '用户管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/department', icon: <BankOutlined />, label: '院系管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/class', icon: <BookOutlined />, label: '班级管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/course', icon: <ReadOutlined />, label: '课程管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/enrollment', icon: <FormOutlined />, label: '选课中心', roles: ['ROLE_STUDENT'] },
  { key: '/score', icon: <TrophyOutlined />, label: '成绩查询', roles: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'] },
  { key: '/log', icon: <FileTextOutlined />, label: '操作日志', roles: ['ROLE_ADMIN'] },
];

const roleLabelMap: Record<string, string> = {
  ROLE_ADMIN: '管理员',
  ROLE_TEACHER: '教师',
  ROLE_STUDENT: '学生',
};

const pageTitleMap: Record<string, string> = {
  '/': '工作台',
  '/user': '用户管理',
  '/department': '院系管理',
  '/class': '班级管理',
  '/course': '课程管理',
  '/enrollment': '选课中心',
  '/score': '成绩查询',
  '/log': '操作日志',
};

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRole();
  const username = getUsername();
  const roleLabel = roleLabelMap[role] || '用户';
  const avatarChar = (username[0] || 'U').toUpperCase();
  const pageTitle = pageTitleMap[location.pathname] || '';

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="app-sider"
        width={220}
      >
        <div className="sider-logo">
          <div className="sider-logo-mark">SM</div>
          {!collapsed && (
            <div>
              <div className="sider-logo-text">学生管理系统</div>
              <span className="sider-logo-sub">STUDENT · ADMIN</span>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: 1, color: 'var(--text-primary)' }}>
              {pageTitle}
            </span>
          </div>
          <Dropdown
            menu={{
              items: [
                { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
              ],
            }}
            placement="bottomRight"
          >
            <span className="header-avatar">
              <span className="header-avatar-circle">{avatarChar}</span>
              <span className="header-avatar-text">
                <span className="header-avatar-name">{username}</span>
                <span className="header-avatar-role">{roleLabel}</span>
              </span>
            </span>
          </Dropdown>
        </Header>
        <Content style={{
          margin: 20,
          padding: 0,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

