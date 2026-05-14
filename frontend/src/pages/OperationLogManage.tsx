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

  const operationStyle = (operation: string): React.CSSProperties => {
    const base = { border: 'none', fontWeight: 500 };
    if (operation.includes('删除') || operation.includes('退课'))
      return { ...base, background: '#FBEBEE', color: '#B5384D' };
    if (operation.includes('添加') || operation.includes('增加') || operation.includes('录入') || operation.includes('注册'))
      return { ...base, background: '#E8F2EC', color: '#2D6A4F' };
    if (operation.includes('编辑') || operation.includes('修改'))
      return { ...base, background: '#FAF1DE', color: '#A87B1F' };
    if (operation.includes('登录'))
      return { ...base, background: '#ECF0EE', color: '#4A6B5C' };
    if (operation.includes('选课'))
      return { ...base, background: '#EFF4F1', color: '#6B8E7F' };
    return { ...base, background: '#F2EFE6', color: '#6B6B6B' };
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '操作用户', dataIndex: 'username', key: 'username', width: 120 },
    {
      title: '操作类型', dataIndex: 'operation', key: 'operation', width: 140,
      render: (text: string) => <Tag style={operationStyle(text)}>{text}</Tag>,
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
