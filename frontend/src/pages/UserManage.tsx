import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getUserList, addUser, editUser, deleteUser } from '../api/user';

interface UserRecord {
  id: number;
  username: string;
  role: string;
  number: string;
  classId: number;
  gender: string;
  phoneNumber: string;
  status: boolean;
}

export default function UserManage() {
  const [data, setData] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserList(page, pageSize);
      const d = (res as any).data;
      setData(d.records);
      setTotal(d.total);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, pageSize]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: UserRecord) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editUser({ ...values, id: editing.id });
      message.success('修改成功');
    } else {
      await addUser(values);
      message.success('添加成功');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '角色', dataIndex: 'role', key: 'role', render: (role: string) => {
      const map: Record<string, string> = { ROLE_ADMIN: '管理员', ROLE_TEACHER: '教师', ROLE_STUDENT: '学生' };
      return map[role] || role;
    }},
    { title: '学工号', dataIndex: 'number', key: 'number', render: (v: string) => v || '-' },
    { title: '性别', dataIndex: 'gender', key: 'gender', render: (g: string) => {
      if (!g) return '-';
      return g === 'MAN' ? '男' : '女';
    }},
    { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber', render: (v: string) => v || '-' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: boolean) => s ? '启用' : '禁用' },
    {
      title: '操作', key: 'action', render: (_: unknown, record: UserRecord) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加用户</Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page, pageSize, total,
          onChange: (p, s) => { setPage(p); setPageSize(s); },
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />
      <Modal
        title={editing ? '编辑用户' : '添加用户'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={editing ? [] : [{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder={editing ? '不修改请留空' : ''} />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select options={[
              { value: 'ROLE_ADMIN', label: '管理员' },
              { value: 'ROLE_TEACHER', label: '教师' },
              { value: 'ROLE_STUDENT', label: '学生' },
            ]} />
          </Form.Item>
          <Form.Item name="number" label="学工号">
            <Input placeholder="学生填学号，教师填工号" />
          </Form.Item>
          <Form.Item name="classId" label="班级ID">
            <Input type="number" placeholder="仅学生需要填写" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select allowClear options={[
              { value: 'MAN', label: '男' },
              { value: 'WOMAN', label: '女' },
            ]} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="手机号">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={[
              { value: true, label: '启用' },
              { value: false, label: '禁用' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
