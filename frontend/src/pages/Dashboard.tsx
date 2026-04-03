import { Card, Descriptions } from 'antd';
import { getUsername, getRole } from '../utils/auth';

const roleMap: Record<string, string> = {
  ROLE_ADMIN: '管理员',
  ROLE_TEACHER: '教师',
  ROLE_STUDENT: '学生',
};

export default function Dashboard() {
  const username = getUsername();
  const role = getRole();

  return (
    <Card title="个人信息">
      <Descriptions column={1}>
        <Descriptions.Item label="用户名">{username}</Descriptions.Item>
        <Descriptions.Item label="角色">{roleMap[role] || role}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
