import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, register, type LoginParams } from '../api/user';
import { setToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    } catch {
      // interceptor handles error
    } finally {
      setLoading(false);
    }
  };

  const formContent = (onFinish: (values: LoginParams) => void, buttonText: string) => (
    <Form onFinish={onFinish} size="large">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );

  const items = [
    { key: 'login', label: '登录', children: formContent(handleLogin, '登录') },
    { key: 'register', label: '注册', children: formContent(handleRegister, '注册') },
  ];

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
    }}>
      <Card style={{ width: 400 }} title="学生管理系统">
        <Tabs items={items} centered />
      </Card>
    </div>
  );
}
