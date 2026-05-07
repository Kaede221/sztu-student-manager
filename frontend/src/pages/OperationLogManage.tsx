import { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { getOperationLogs } from '../api/log';

interface LogRecord {
  id: number;
  username: string;
  operation: string;
  method: string;
  params: string;
  ip: string;
  createdAt: string;
}

export default function OperationLogManage() {
  const [data, setData] = useState<LogRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOperationLogs(page, pageSize);
      const d = (res as any).data;
      setData(d.records);
      setTotal(d.total);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, pageSize]);

  const operationColor = (operation: string) => {
    if (operation.includes('删除') || operation.includes('退课')) return 'red';
    if (operation.includes('添加') || operation.includes('增加') || operation.includes('录入') || operation.includes('注册')) return 'green';
    if (operation.includes('编辑') || operation.includes('修改')) return 'blue';
    if (operation.includes('登录')) return 'purple';
    if (operation.includes('选课')) return 'cyan';
    return 'default';
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '操作用户', dataIndex: 'username', key: 'username', width: 120 },
    {
      title: '操作类型', dataIndex: 'operation', key: 'operation', width: 140,
      render: (text: string) => <Tag color={operationColor(text)}>{text}</Tag>,
    },
    { title: '请求方法', dataIndex: 'method', key: 'method', ellipsis: true },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '操作时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
  ];

  return (
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
  );
}
