import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getStudentList, addStudent, editStudent, deleteStudent } from '../api/student';

interface StudentRecord {
  id: number;
  studentNumber: string;
  userId: number;
  classId: number;
  gender: string;
  phoneNumber: string;
}

export default function StudentManage() {
  const [data, setData] = useState<StudentRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudentRecord | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getStudentList(page, pageSize);
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

  const handleEdit = (record: StudentRecord) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteStudent(id);
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editStudent({ ...values, id: editing.id });
      message.success('修改成功');
    } else {
      await addStudent(values);
      message.success('添加成功');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '学号', dataIndex: 'studentNumber', key: 'studentNumber' },
    { title: '用户ID', dataIndex: 'userId', key: 'userId' },
    { title: '班级ID', dataIndex: 'classId', key: 'classId' },
    { title: '性别', dataIndex: 'gender', key: 'gender', render: (g: string) => g === 'MAN' ? '男' : '女' },
    { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: '操作', key: 'action', render: (_: unknown, record: StudentRecord) => (
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加学生</Button>
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
        title={editing ? '编辑学生' : '添加学生'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="studentNumber" label="学号" rules={[{ required: true, message: '请输入学号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="用户ID" rules={[{ required: true, message: '请输入用户ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="classId" label="班级ID" rules={[{ required: true, message: '请输入班级ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
            <Select options={[
              { value: 'MAN', label: '男' },
              { value: 'WOMAN', label: '女' },
            ]} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
