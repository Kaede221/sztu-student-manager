import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tag } from 'antd';
import { getCourseList } from '../api/course';
import { enrollCourse, dropCourse, getMyEnrollments } from '../api/enrollment';

interface CourseRecord {
  id: number;
  name: string;
  credit: number;
  teacherId: number;
  capacity: number;
  description: string;
}

interface EnrollmentRecord {
  id: number;
  studentId: number;
  courseId: number;
  status: string;
}

export default function EnrollmentManage() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [myEnrollments, setMyEnrollments] = useState<EnrollmentRecord[]>([]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourseList(page, pageSize);
      const d = (res as any).data;
      setCourses(d.records);
      setTotal(d.total);
    } catch { /* handled */ }
    setLoading(false);
  };

  const fetchMyEnrollments = async () => {
    try {
      const res = await getMyEnrollments();
      setMyEnrollments((res as any).data || []);
    } catch { /* handled */ }
  };

  useEffect(() => { fetchCourses(); }, [page, pageSize]);
  useEffect(() => { fetchMyEnrollments(); }, []);

  // 已选课程 ID 集合
  const enrolledCourseIds = new Set(myEnrollments.map(e => e.courseId));

  const handleEnroll = async (courseId: number) => {
    try {
      await enrollCourse(courseId);
      message.success('选课成功');
      fetchMyEnrollments();
    } catch { /* handled */ }
  };

  const handleDrop = async (courseId: number) => {
    try {
      await dropCourse(courseId);
      message.success('退课成功');
      fetchMyEnrollments();
    } catch { /* handled */ }
  };

  const columns = [
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '学分', dataIndex: 'credit', key: 'credit', width: 80 },
    { title: '容量', dataIndex: 'capacity', key: 'capacity', width: 80 },
    { title: '课程简介', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '选课状态', key: 'status', width: 100,
      render: (_: unknown, record: CourseRecord) => (
        enrolledCourseIds.has(record.id)
          ? <Tag color="green">已选</Tag>
          : <Tag>未选</Tag>
      ),
    },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, record: CourseRecord) => {
        if (enrolledCourseIds.has(record.id)) {
          return (
            <Popconfirm title="确定退课？" onConfirm={() => handleDrop(record.id)}>
              <Button type="link" danger>退课</Button>
            </Popconfirm>
          );
        }
        return (
          <Popconfirm title="确定选课？" onConfirm={() => handleEnroll(record.id)}>
            <Button type="link">选课</Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={courses}
      loading={loading}
      pagination={{
        current: page, pageSize, total,
        onChange: (p, s) => { setPage(p); setPageSize(s); },
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 门课程`,
      }}
    />
  );
}
