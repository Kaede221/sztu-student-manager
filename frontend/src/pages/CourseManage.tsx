import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getCourseList, addCourse, editCourse, deleteCourse } from '../api/course';
import { getUserList } from '../api/user';
import { getRole } from '../utils/auth';

interface CourseRecord {
  id: number;
  name: string;
  credit: number;
  teacherId: number;
  capacity: number;
  description: string;
}

interface TeacherOption {
  id: number;
  username: string;
}

export default function CourseManage() {
  const [data, setData] = useState<CourseRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRecord | null>(null);
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  const role = getRole();
  const isAdmin = role === 'ROLE_ADMIN';
  const canEdit = isAdmin || role === 'ROLE_TEACHER';

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCourseList(page, pageSize);
      const d = (res as any).data;
      setData(d.records);
      setTotal(d.total);
    } catch { /* handled */ }
    setLoading(false);
  };

  const fetchTeachers = async () => {
    try {
      const res = await getUserList(1, 999, { role: 'ROLE_TEACHER' });
      setTeachers((res as any).data.records);
    } catch { /* handled */ }
  };

  useEffect(() => { fetchData(); }, [page, pageSize]);
  useEffect(() => { fetchTeachers(); }, []);

  const teacherMap = new Map(teachers.map(t => [t.id, t.username]));

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: CourseRecord) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteCourse(id);
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editCourse({ ...values, id: editing.id });
      message.success('修改成功');
    } else {
      await addCourse(values);
      message.success('添加成功');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '学分', dataIndex: 'credit', key: 'credit', width: 80 },
    { title: '授课教师', dataIndex: 'teacherId', key: 'teacherId', render: (id: number) => teacherMap.get(id) || '-' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity', width: 80 },
    { title: '课程简介', dataIndex: 'description', key: 'description', ellipsis: true },
    ...(canEdit ? [{
      title: '操作', key: 'action', render: (_: unknown, record: CourseRecord) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    }] : []),
  ];

  return (
    <>
      {canEdit && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加课程</Button>
        </div>
      )}
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
        title={editing ? '编辑课程' : '添加课程'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="课程名称" rules={[{ required: true, message: '请输入课程名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="credit" label="学分" rules={[{ required: true, message: '请输入学分' }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="teacherId" label="授课教师" rules={[{ required: true, message: '请选择授课教师' }]}>
            <Select
              showSearch
              optionFilterProp="label"
              options={teachers.map(t => ({ value: t.id, label: t.username }))}
            />
          </Form.Item>
          <Form.Item name="capacity" label="课程容量" rules={[{ required: true, message: '请输入容量' }]}>
            <InputNumber min={1} max={500} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="课程简介">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
