import { useEffect, useState } from 'react';
import { Table, Card, Select, Button, Modal, InputNumber, Form, message, Tag } from 'antd';
import { getMyScores, getCourseScores, insertScore, updateScore } from '../api/score';
import { getCourseList } from '../api/course';
import { getMyEnrollments, getEnrollmentsByCourse } from '../api/enrollment';
import { getUserList } from '../api/user';
import { getRole } from '../utils/auth';

interface ScoreRecord {
  id: number;
  enrollmentId: number;
  score: number;
}

interface EnrollmentRecord {
  id: number;
  studentId: number;
  courseId: number;
  status: string;
}

interface CourseRecord {
  id: number;
  name: string;
}

interface UserRecord {
  id: number;
  username: string;
}

// 学生视角：查看自己的成绩
function StudentScoreView() {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scoreRes, enrollRes, courseRes] = await Promise.all([
        getMyScores(),
        getMyEnrollments(),
        getCourseList(1, 999),
      ]);
      setScores((scoreRes as any).data || []);
      setEnrollments((enrollRes as any).data || []);
      setCourses((courseRes as any).data?.records || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const courseMap = new Map(courses.map(c => [c.id, c.name]));
  const enrollmentMap = new Map(enrollments.map(e => [e.id, e]));

  const columns = [
    {
      title: '课程名称', key: 'courseName',
      render: (_: unknown, record: ScoreRecord) => {
        const enrollment = enrollmentMap.get(record.enrollmentId);
        return enrollment ? courseMap.get(enrollment.courseId) || '-' : '-';
      },
    },
    {
      title: '成绩', dataIndex: 'score', key: 'score',
      render: (score: number) => {
        if (score >= 90) return <Tag color="green">{score}</Tag>;
        if (score >= 60) return <Tag color="blue">{score}</Tag>;
        return <Tag color="red">{score}</Tag>;
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={scores}
      loading={loading}
      pagination={false}
    />
  );
}

// 教师/管理员视角：录入和管理成绩
function TeacherScoreView() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<ScoreRecord | null>(null);
  const [currentEnrollmentId, setCurrentEnrollmentId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchCourses = async () => {
    try {
      const res = await getCourseList(1, 999);
      setCourses((res as any).data?.records || []);
    } catch { /* handled */ }
  };

  const fetchCourseData = async (courseId: number) => {
    setLoading(true);
    try {
      const [enrollRes, scoreRes, userRes] = await Promise.all([
        getEnrollmentsByCourse(courseId),
        getCourseScores(courseId),
        getUserList(1, 999),
      ]);
      setEnrollments((enrollRes as any).data || []);
      setScores((scoreRes as any).data || []);
      setUsers((userRes as any).data?.records || []);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) fetchCourseData(selectedCourse);
  }, [selectedCourse]);

  const userMap = new Map(users.map(u => [u.id, u.username]));
  const scoreMap = new Map(scores.map(s => [s.enrollmentId, s]));

  const handleAddScore = (enrollmentId: number) => {
    setEditingScore(null);
    setCurrentEnrollmentId(enrollmentId);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEditScore = (score: ScoreRecord) => {
    setEditingScore(score);
    setCurrentEnrollmentId(score.enrollmentId);
    form.setFieldsValue({ score: score.score });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingScore) {
      await updateScore({ id: editingScore.id, score: values.score });
      message.success('修改成功');
    } else {
      await insertScore({ enrollmentId: currentEnrollmentId!, score: values.score });
      message.success('录入成功');
    }
    setModalOpen(false);
    if (selectedCourse) fetchCourseData(selectedCourse);
  };

  const columns = [
    {
      title: '学生', key: 'student',
      render: (_: unknown, record: EnrollmentRecord) => userMap.get(record.studentId) || '-',
    },
    {
      title: '选课状态', key: 'status', width: 100,
      render: (_: unknown, record: EnrollmentRecord) => (
        record.status === 'ENROLLED'
          ? <Tag color="green">已选</Tag>
          : <Tag color="red">已退</Tag>
      ),
    },
    {
      title: '成绩', key: 'score', width: 100,
      render: (_: unknown, record: EnrollmentRecord) => {
        const s = scoreMap.get(record.id);
        if (!s) return <Tag>未录入</Tag>;
        if (s.score >= 90) return <Tag color="green">{s.score}</Tag>;
        if (s.score >= 60) return <Tag color="blue">{s.score}</Tag>;
        return <Tag color="red">{s.score}</Tag>;
      },
    },
    {
      title: '操作', key: 'action', width: 150,
      render: (_: unknown, record: EnrollmentRecord) => {
        const s = scoreMap.get(record.id);
        if (s) {
          return <Button type="link" onClick={() => handleEditScore(s)}>修改成绩</Button>;
        }
        return <Button type="link" onClick={() => handleAddScore(record.id)}>录入成绩</Button>;
      },
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 300 }}
          placeholder="请选择课程"
          value={selectedCourse}
          onChange={setSelectedCourse}
          options={courses.map(c => ({ value: c.id, label: c.name }))}
        />
      </Card>
      {selectedCourse && (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={enrollments}
          loading={loading}
          pagination={false}
        />
      )}
      <Modal
        title={editingScore ? '修改成绩' : '录入成绩'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="score" label="成绩" rules={[{ required: true, message: '请输入成绩' }]}>
            <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default function ScoreManage() {
  const role = getRole();

  if (role === 'ROLE_STUDENT') {
    return <StudentScoreView />;
  }
  return <TeacherScoreView />;
}
