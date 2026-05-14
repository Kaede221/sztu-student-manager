import { useState } from 'react';
import { Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, register, type LoginParams } from '../api/user';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    try {
      const res = await login(values);
      setToken((res as any).data);
      message.success('登录成功');
      navigate('/');
    } catch {
      // interceptor handles error
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: LoginParams) => {
    setLoading(true);
    try {
      await register(values);
      message.success('注册成功，请登录');
      setActiveTab('login');
    } catch {
      // interceptor handles error
    } finally {
      setLoading(false);
    }
  };

  const formContent = (onFinish: (values: LoginParams) => void, buttonText: string) => (
    <Form onFinish={onFinish} size="large" autoComplete="off">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined style={{ color: 'var(--text-tertiary)' }} />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-tertiary)' }} />} placeholder="密码" />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    { key: 'login', label: '登录账户', children: formContent(handleLogin, '登 录') },
    { key: 'register', label: '注册账户', children: formContent(handleRegister, '注 册') },
  ];

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero-grid" />
        <div className="login-hero-top">
          <div className="login-hero-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
            EDUCATION · MANAGEMENT
          </div>
          <div className="login-hero-title">学生管理系统</div>
          <div className="login-hero-subtitle">Student Management Platform</div>
        </div>
        <div className="login-hero-bottom">
          <div className="login-hero-quote">
            "教育不是注满一桶水，而是点燃一把火。"
          </div>
          <div className="login-hero-quote-sub">— W. B. YEATS</div>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form-inner">
          <div className="login-form-title">欢迎回来</div>
          <div className="login-form-desc">请登录您的账户继续访问系统</div>
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarGutter={24}
          />
        </div>
      </div>
    </div>
  );
}
