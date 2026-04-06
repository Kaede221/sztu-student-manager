# 学生管理系统

一个基于 Spring Boot + React 的学生信息管理平台，支持管理员、教师、学生三种角色，实现用户管理、课程管理、选课、成绩管理等功能。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + TypeScript + Vite + Ant Design 6 + Axios + React Router |
| 后端 | Spring Boot 4 + Java 17 + Maven + MyBatis-Plus + Spring Security + JWT + SpringDoc OpenAPI |
| 数据库 | MySQL |

## 功能概览

### 角色权限

| 功能 | 管理员 | 教师 | 学生 |
| --- | :---: | :---: | :---: |
| 用户管理（增删改查） | ✓ | 只读 | - |
| 院系管理 | ✓ | 只读 | - |
| 班级管理 | ✓ | 只读 | - |
| 课程管理 | ✓ | ✓ | - |
| 选课 / 退课 | - | - | ✓ |
| 成绩录入 / 修改 | ✓ | ✓ | - |
| 成绩查询 | 全部 | 自己课程 | 自己的 |
| 个人信息编辑 | ✓ | ✓ | ✓ |
| 数据统计看板 | ✓ | - | - |

### 主要功能

- **参数校验** — 基于 JSR 380，每个写操作使用独立 DTO，前后端校验规则对齐
- **接口文档** — SpringDoc OpenAPI 自动生成，访问 `/swagger-ui/index.html` 查看
- **用户认证** — JWT Token 登录，BCrypt 密码加密，角色权限控制
- **用户管理** — 分页查询，多条件筛选（用户名、角色、学号、班级、性别、手机号、状态）
- **院系 / 班级管理** — CRUD，班级关联院系
- **课程管理** — CRUD，关联授课教师，课程容量控制
- **选课系统** — 学生选课 / 退课，已选人数校验，防重复选课
- **成绩管理** — 教师按课程录入成绩，学生查看个人成绩
- **数据看板** — 管理员首页展示用户数、班级数、院系数等统计
- **个人中心** — 查看和编辑个人信息

## 项目结构

```
├── backend/                      Spring Boot 后端
│   └── src/main/java/com/studentmanager/
│       ├── backend/              启动类
│       ├── common/               通用类（RequestResult, JwtUtil, GlobalExceptionHandler）
│       ├── config/               配置类（SecurityConfig, MyBatisPlusConfig）
│       ├── controller/           控制器
│       ├── dto/                  数据传输对象（按模块分包，含参数校验注解）
│       │   ├── course/          课程相关 DTO
│       │   ├── classes/         班级相关 DTO
│       │   ├── department/      院系相关 DTO
│       │   ├── score/           成绩相关 DTO
│       │   └── user/            用户相关 DTO
│       ├── mapper/               MyBatis-Plus Mapper
│       ├── model/                实体类
│       ├── service/              Service 接口
│       └── service/impl/         Service 实现
├── frontend/                     React 前端
│   └── src/
│       ├── api/                  API 请求模块
│       ├── components/           通用组件
│       ├── layouts/              布局组件
│       ├── pages/                页面
│       └── utils/                工具函数
└── README.md
```

## 快速开始

### 方式一：Docker 部署（推荐）

只需安装 Docker，无需手动配置数据库，一键启动：

```bash
cd backend
docker compose up -d
```

首次启动会自动构建后端镜像、创建 MySQL 容器并执行建表脚本。

- 后端：`http://localhost:8080`
- 接口文档：`http://localhost:8080/swagger-ui/index.html`
- MySQL：`localhost:3306`（用户名 `root`，密码 `root`）

常用命令：

```bash
docker compose logs -f backend   # 查看后端日志
docker compose down              # 停止服务
docker compose down -v           # 停止并清除数据库数据
docker compose up -d --build     # 代码修改后重新构建启动
```

### 方式二：本地开发

#### 环境要求

- Java 17+
- Node.js 18+
- MySQL 8+
- pnpm

#### 数据库初始化

创建数据库并执行建表脚本（建表 SQL 位于 `backend/db/init.sql`）：

```bash
mysql -uroot -p < backend/db/init.sql
```

<details>
<summary>或手动执行以下 SQL</summary>

```sql
CREATE DATABASE stumanage;
USE stumanage;

CREATE TABLE my_user (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) DEFAULT 'ROLE_STUDENT',
  status      TINYINT DEFAULT 1,
  number      VARCHAR(50) UNIQUE,
  class_id    BIGINT,
  gender      VARCHAR(50) DEFAULT 'MAN',
  phone_number VARCHAR(20)
);

CREATE TABLE my_department (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL
);

CREATE TABLE my_class (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  department_id BIGINT NOT NULL,
  name          VARCHAR(100) NOT NULL,
  grade         INT NOT NULL
);

CREATE TABLE my_course (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL DEFAULT '默认课程',
  credit      INT NOT NULL DEFAULT 1,
  teacher_id  BIGINT NOT NULL,
  capacity    INT NOT NULL DEFAULT 50,
  description VARCHAR(200)
);

CREATE TABLE my_enrollment (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  course_id  BIGINT NOT NULL,
  status     VARCHAR(100) DEFAULT 'ENROLLED' NOT NULL
);

CREATE TABLE my_score (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  enrollment_id BIGINT NOT NULL,
  score         DECIMAL(5, 2) NOT NULL
);
```

</details>

#### 后端启动

```bash
cd backend
# 修改 src/main/resources/application.yaml 中的数据库连接信息
./mvnw spring-boot:run
```

后端默认运行在 `http://localhost:8080`，接口文档访问 `http://localhost:8080/swagger-ui/index.html`

#### 前端启动

```bash
cd frontend
pnpm install
pnpm dev
```

前端默认运行在 `http://localhost:5173`

### 初始使用

1. 通过注册页面创建账号（默认角色为学生）
2. 在数据库中手动将某个用户的 `role` 改为 `ROLE_ADMIN` 以获得管理员权限
3. 使用管理员账号登录后即可管理所有功能
