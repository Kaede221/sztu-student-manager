import { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Modal, Form, Select, Input, message, Spin, Row, Col, Statistic } from 'antd';
import {
  EditOutlined, UserOutlined, BankOutlined, BookOutlined,
  ReadOutlined, FormOutlined, LockOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMyInfo, editMyInfo, getStats, changePassword } from '../api/user';
import { getAllClasses } from '../api/clazz';
import { getRole } from '../utils/auth';

const roleMap: Record<string, string> = {
  ROLE_ADMIN: '管理员',
  ROLE_TEACHER: '教师',
  ROLE_STUDENT: '学生',
};

interface UserInfo {
  id: number;
  username: string;
  role: string;
  number: string;
  classId: number;
  gender: string;
  phoneNumber: string;
  status: boolean;
}

interface ClassOption {
  id: number;
  name: string;
}

interface StatsData {
  userCount: number;
  classCount: number;
  departmentCount: number;
  studentCount: number;
  teacherCount: number;
  adminCount: number;
  courseCount: number;
  enrollmentCount: number;
}

const COLORS = ['#1677ff', '#52c41a', '#faad14'];

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);

  const isAdmin = getRole() === 'ROLE_ADMIN';

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await getMyInfo();
      setUserInfo((res as any).data);
    } catch { /* handled */ }
    setLoading(false);
  };

  const fetchClasses = async () => {
    try {
      const res = await getAllClasses();
      setClassOptions((res as any).data);
    } catch { /* handled */ }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats((res as any).data);
    } catch { /* handled */ }
  };

  useEffect(() => {
    fetchInfo();
    fetchClasses();
    if (isAdmin) fetchStats();
  }, []);

  const classMap = new Map(classOptions.map(c => [c.id, c.name]));

  const handleEdit = () => {
    if (userInfo) {
      form.setFieldsValue({
        gender: userInfo.gender,
        phoneNumber: userInfo.phoneNumber,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await editMyInfo(values);
    message.success('修改成功');
    setModalOpen(false);
    fetchInfo();
  };

  const handlePasswordChange = async () => {
    const values = await passwordForm.validateFields();
    try {
      await changePassword(values);
      message.success('密码修改成功，请重新登录');
      setPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch { /* handled by interceptor */ }
  };

  if (loading) return <Spin />;
  if (!userInfo) return null;

  const rolePieData = stats ? [
    { name: '学生', value: stats.studentCount },
    { name: '教师', value: stats.teacherCount },
    { name: '管理员', value: stats.adminCount },
  ] : [];

  return (
    <>
      {isAdmin && stats && (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={4}>
              <Card>
                <Statistic title="用户总数" value={stats.userCount} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic title="学生数" value={stats.studentCount} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic title="教师数" value={stats.teacherCount} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic title="课程数" value={stats.courseCount} prefix={<ReadOutlined />} />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic title="院系数" value={stats.departmentCount} prefix={<BankOutlined />} />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic title="选课人次" value={stats.enrollmentCount} prefix={<FormOutlined />} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card title="用户角色分布">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={rolePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {rolePieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="系统概况">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic title="班级总数" value={stats.classCount} prefix={<BookOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="课程总数" value={stats.courseCount} prefix={<ReadOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="院系总数" value={stats.departmentCount} prefix={<BankOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="选课人次" value={stats.enrollmentCount} prefix={<FormOutlined />} />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Card
        title="个人信息"
        extra={
          <>
            <Button type="link" icon={<LockOutlined />} onClick={() => { passwordForm.resetFields(); setPasswordModalOpen(true); }}>修改密码</Button>
            <Button type="link" icon={<EditOutlined />} onClick={handleEdit}>编辑资料</Button>
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
          <Descriptions.Item label="角色">{roleMap[userInfo.role] || userInfo.role}</Descriptions.Item>
          <Descriptions.Item label="学工号">{userInfo.number || '-'}</Descriptions.Item>
          <Descriptions.Item label="班级">{classMap.get(userInfo.classId) || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">{userInfo.gender === 'MAN' ? '男' : userInfo.gender === 'WOMAN' ? '女' : '-'}</Descriptions.Item>
          <Descriptions.Item label="手机号">{userInfo.phoneNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="账号状态">{userInfo.status ? '启用' : '禁用'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 编辑资料弹窗 */}
      <Modal
        title="编辑个人信息"
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="gender" label="性别">
            <Select allowClear options={[
              { value: 'MAN', label: '男' },
              { value: 'WOMAN', label: '女' },
            ]} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="手机号">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onOk={handlePasswordChange}
        onCancel={() => setPasswordModalOpen(false)}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码" rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码至少6位' },
          ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
