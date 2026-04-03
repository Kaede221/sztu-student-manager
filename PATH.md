# 学生管理系统 — 课设设计方案

## 🎯 系统定位

一个面向学校的学生信息管理平台，支持**管理员、教师、学生**三种角色，实现学生信息、课程、成绩的全流程管理。

---

## 👥 角色权限设计

| 角色   | 权限范围                         |
| ------ | -------------------------------- |
| 管理员 | 全部功能，用户管理，系统配置     |
| 教师   | 管理自己课程、录入成绩、查看学生 |
| 学生   | 查看个人信息、成绩、选课         |

---

## 📦 核心功能模块

### 1. 用户认证模块
- 登录 / 登出（JWT Token）
- 不同角色登录后跳转不同首页
- 修改密码、找回密码

### 2. 学生信息管理
- 学生列表（搜索、筛选、分页）
- 新增 / 编辑 / 删除学生
- 学生详情页（基本信息 + 成绩 + 选课）
- 批量导入（Excel 上传）/ 导出

### 3. 课程管理
- 课程列表（课程名、学分、教师、上课时间）
- 新增 / 编辑 / 删除课程
- 课程容量控制（已选人数 / 最大人数）

### 4. 选课管理
- 学生端：浏览课程、选课、退课
- 教师端：查看自己课程的选课名单
- 管理员端：查看 / 干预所有选课记录

### 5. 成绩管理
- 教师录入 / 修改成绩
- 学生查看个人成绩单
- 成绩统计（平均分、最高分、不及格人数）
- 成绩导出 Excel

### 6. 班级 / 院系管理
- 维护院系、专业、班级基础数据
- 学生归属班级管理

### 7. 数据统计看板（首页 Dashboard）
- 学生总数、课程总数、本期选课人次
- 各课程成绩分布图（柱状图）
- 近期操作日志

---

## 🗄️ 数据库表设计思路

```
users          — 用户表（id, username, password, role, ...）
students       — 学生表（id, user_id, name, gender, sno, class_id, ...）
teachers       — 教师表（id, user_id, name, dept_id, ...）
departments    — 院系表
classes        — 班级表（id, name, dept_id, ...）
courses        — 课程表（id, name, credit, teacher_id, capacity, ...）
enrollments    — 选课表（id, student_id, course_id, status, ...）
scores         — 成绩表（id, enrollment_id, score, grade, ...）
```

---

## 🖥️ 前端页面规划（React）

```
/login                    登录页
/dashboard                首页看板
/students                 学生列表
/students/:id             学生详情
/courses                  课程列表
/courses/:id              课程详情（含选课名单）
/enrollment               选课页面（学生用）
/scores                   成绩管理
/scores/my                我的成绩（学生用）
/departments              院系班级管理
/users                    用户管理（管理员）
/profile                  个人信息
```

---

## ⚙️ 后端接口规划（Spring Boot RESTful）

```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/students          （分页+搜索）
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}

GET    /api/courses
POST   /api/courses
PUT    /api/courses/{id}

POST   /api/enrollments       选课
DELETE /api/enrollments/{id}  退课
GET    /api/enrollments?courseId=

GET    /api/scores?studentId=
PUT    /api/scores/{id}       录入/修改成绩

GET    /api/stats/overview    首页统计数据
```

---

## 🛠️ 技术栈建议

| 层     | 技术                                      |
| ------ | ----------------------------------------- |
| 前端   | React + Ant Design + Axios + React Router |
| 后端   | Spring Boot + MyBatis-Plus / JPA          |
| 数据库 | MySQL                                     |
| 认证   | JWT + Spring Security                     |
| 工具   | EasyExcel（导入导出）、Lombok             |

---

## 📋 推荐开发顺序

1. **搭环境** — 前后端项目初始化，数据库建表
2. **认证模块** — 登录/JWT，这是其他一切的基础
3. **基础数据** — 院系、班级、课程 CRUD
4. **学生管理** — 核心功能，含 Excel 导入
5. **选课功能** — 需要并发控制（防超选）
6. **成绩管理** — 录入、统计、导出
7. **Dashboard** — 最后做，数据都有了再聚合展示

---

> 💡 **亮点加分项**（时间充裕可以做）：选课冲突检测、成绩绩点自动计算、操作日志记录、数据可视化图表（ECharts/Recharts）

有哪个模块想深入讨论设计细节，或者需要数据库 DDL / 接口文档示例，随时告诉我！