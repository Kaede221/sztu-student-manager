import { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Modal, Form, Select, Input, message, Spin, Row, Col, Tag } from 'antd';
import {
  EditOutlined, UserOutlined, BankOutlined, BookOutlined,
  ReadOutlined, FormOutlined, LockOutlined, TeamOutlined, SafetyCertificateOutlined,
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

// 学院森林配色 + 苔色
const CHART_COLORS = ['#2D6A4F', '#C9962E', '#6B8E7F'];

interface StatCardConfig {
  key: keyof StatsData;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const statCards: StatCardConfig[] = [
  { key: 'userCount',       label: '用户总数', icon: <TeamOutlined />,             iconBg: '#E8F2EC', iconColor: '#2D6A4F' },
  { key: 'studentCount',    label: '学生人数', icon: <UserOutlined />,             iconBg: '#FAF1DE', iconColor: '#C9962E' },
  { key: 'teacherCount',    label: '教师人数', icon: <SafetyCertificateOutlined />,iconBg: '#ECF0EE', iconColor: '#4A6B5C' },
  { key: 'courseCount',     label: '课程数',   icon: <ReadOutlined />,             iconBg: '#E8F2EC', iconColor: '#2D6A4F' },
  { key: 'departmentCount', label: '院系数',   icon: <BankOutlined />,             iconBg: '#F2EFE6', iconColor: '#6B6B6B' },
  { key: 'enrollmentCount', label: '选课人次', icon: <FormOutlined />,             iconBg: '#FAF1DE', iconColor: '#A87B1F' },
];

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

  if (loading) return <div style={{ padding: 48, textAlign: 'center' }}><Spin /></div>;
  if (!userInfo) return null;

  const rolePieData = stats ? [
    { name: '学生', value: stats.studentCount },
    { name: '教师', value: stats.teacherCount },
    { name: '管理员', value: stats.adminCount },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {isAdmin && stats && (
        <>
          <Row gutter={[16, 16]}>
            {statCards.map((card) => (
              <Col xs={12} sm={8} lg={4} key={card.key}>
                <Card className="card-hover" styles={{ body: { padding: 18 } }}>
                  <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                      {card.icon}
                    </div>
                    <div className="stat-card-body">
                      <div className="stat-card-label">{card.label}</div>
                      <div className="stat-card-value">{stats[card.key]}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={<span className="section-title">用户角色分布</span>}
                extra={<Tag style={{ background: 'var(--bg-tag-soft)', color: 'var(--color-primary)', border: 'none' }}>实时</Tag>}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={rolePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, value }) => `${name} ${value}`}
                    >
                      {rolePieData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 10,
                        boxShadow: '0 12px 32px rgba(31,58,46,0.08)',
                      }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={<span className="section-title">系统概况</span>}>
                <Row gutter={[16, 20]}>
                  {[
                    { label: '班级总数', value: stats.classCount,       icon: <BookOutlined /> },
                    { label: '课程总数', value: stats.courseCount,      icon: <ReadOutlined /> },
                    { label: '院系总数', value: stats.departmentCount,  icon: <BankOutlined /> },
                    { label: '选课人次', value: stats.enrollmentCount,  icon: <FormOutlined /> },
                  ].map((it) => (
                    <Col span={12} key={it.label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18,
                        }}>{it.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: 1 }}>{it.label}</div>
                          <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600,
                            letterSpacing: '-0.5px', color: 'var(--text-primary)', lineHeight: 1.2,
                          }}>{it.value}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Card
        title={<span className="section-title">个人信息</span>}
        extra={
          <>
            <Button type="link" icon={<LockOutlined />} onClick={() => { passwordForm.resetFields(); setPasswordModalOpen(true); }}>修改密码</Button>
            {userInfo.username !== 'admin' && (
              <Button type="link" icon={<EditOutlined />} onClick={handleEdit}>编辑资料</Button>
            )}
          </>
        }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
          <Descriptions.Item label="角色">
            <Tag style={{ background: 'var(--bg-tag-soft)', color: 'var(--color-primary)', border: 'none' }}>
              {roleMap[userInfo.role] || userInfo.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="学工号">{userInfo.number || '-'}</Descriptions.Item>
          <Descriptions.Item label="班级">{classMap.get(userInfo.classId) || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">{userInfo.gender === 'MAN' ? '男' : userInfo.gender === 'WOMAN' ? '女' : '-'}</Descriptions.Item>
          <Descriptions.Item label="手机号">{userInfo.phoneNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="账号状态">
            {userInfo.status
              ? <Tag style={{ background: 'var(--bg-tag-soft)', color: 'var(--color-success)', border: 'none' }}>启用</Tag>
              : <Tag style={{ background: 'var(--bg-tag-error)', color: 'var(--color-error)', border: 'none' }}>禁用</Tag>}
          </Descriptions.Item>
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
    </div>
  );
}
