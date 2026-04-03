import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getClassList, addClass, editClass, deleteClass } from '../api/clazz';
import { getAllDepartments } from '../api/department';

interface ClassRecord {
  id: number;
  departmentId: number;
  name: string;
  grade: number;
}

interface DeptOption {
  id: number;
  name: string;
}

export default function ClassManage() {
  const [data, setData] = useState<ClassRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRecord | null>(null);
  const [form] = Form.useForm();
  const [deptOptions, setDeptOptions] = useState<DeptOption[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getClassList(page, pageSize);
      const d = (res as any).data;
      setData(d.records);
      setTotal(d.total);
    } catch { /* handled */ }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      setDeptOptions((res as any).data);
    } catch { /* handled */ }
  };

  useEffect(() => { fetchData(); }, [page, pageSize]);
  useEffect(() => { fetchDepartments(); }, []);

  const deptMap = new Map(deptOptions.map(d => [d.id, d.name]));

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: ClassRecord) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteClass(id);
    message.success('删除成功');
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editClass({ ...values, id: editing.id });
      message.success('修改成功');
    } else {
      await addClass(values);
      message.success('添加成功');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '班级名称', dataIndex: 'name', key: 'name' },
    { title: '所属院系', dataIndex: 'departmentId', key: 'departmentId', render: (id: number) => deptMap.get(id) || id },
    { title: '年级', dataIndex: 'grade', key: 'grade' },
    {
      title: '操作', key: 'action', render: (_: unknown, record: ClassRecord) => (
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加班级</Button>
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
        title={editing ? '编辑班级' : '添加班级'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="班级名称" rules={[{ required: true, message: '请输入班级名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="departmentId" label="所属院系" rules={[{ required: true, message: '请选择院系' }]}>
            <Select
              placeholder="请选择院系"
              options={deptOptions.map(d => ({ value: d.id, label: d.name }))}
            />
          </Form.Item>
          <Form.Item name="grade" label="年级" rules={[{ required: true, message: '请输入年级' }]}>
            <Input type="number" placeholder="例如: 2024" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
