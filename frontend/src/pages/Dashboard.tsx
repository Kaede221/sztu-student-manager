import { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Modal, Form, Select, Input, message, Spin, Row, Col, Statistic } from 'antd';
import { EditOutlined, UserOutlined, BankOutlined, BookOutlined } from '@ant-design/icons';
import { getMyInfo, editMyInfo, getStats } from '../api/user';
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
}

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
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

  if (loading) return <Spin />;
  if (!userInfo) return null;

  return (
    <>
      {isAdmin && stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic title="用户总数" value={stats.userCount} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="院系总数" value={stats.departmentCount} prefix={<BankOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="班级总数" value={stats.classCount} prefix={<BookOutlined />} />
            </Card>
          </Col>
        </Row>
      )}
      <Card
        title="个人信息"
        extra={<Button type="link" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>}
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
    </>
  );
}
