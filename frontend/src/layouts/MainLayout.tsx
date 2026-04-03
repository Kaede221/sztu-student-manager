import { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  BookOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUsername, getRole, removeToken } from '../utils/auth';

const { Header, Sider, Content } = Layout;

const allMenuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页', roles: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'] },
  { key: '/user', icon: <UserOutlined />, label: '用户管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/department', icon: <BankOutlined />, label: '院系管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
  { key: '/class', icon: <BookOutlined />, label: '班级管理', roles: ['ROLE_ADMIN', 'ROLE_TEACHER'] },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const role = getRole();
  const username = getUsername();

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{
          height: 48,
          margin: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: collapsed ? 14 : 16,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          {collapsed ? 'SM' : '学生管理系统'}
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
        <Header style={{
          padding: '0 16px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{
            items: [
              { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
            ],
          }}>
            <span style={{ cursor: 'pointer' }}>
              <UserOutlined style={{ marginRight: 8 }} />
              {username}
            </span>
          </Dropdown>
        </Header>
        <Content style={{
          margin: 16,
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
