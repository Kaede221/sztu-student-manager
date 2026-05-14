# 学生管理系统

一个基于 Spring Boot + React 的学生信息管理平台，支持管理员、教师、学生三种角色，实现用户管理、课程管理、选课、成绩管理等功能。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + TypeScript + Vite + Ant Design 6 + Axios + React Router |
| 后端 | Spring Boot 4 + Java 17 + Maven + MyBatis-Plus + Spring Security + JWT + SpringDoc OpenAPI + AOP + Flyway |
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
| 操作日志 | ✓ | - | - |

### 主要功能

- **参数校验** — 基于 JSR 380，每个写操作使用独立 DTO，前后端校验规则对齐
- **接口文档** — SpringDoc OpenAPI 自动生成，访问 `/swagger-ui/index.html` 查看
- **操作日志** — 基于 AOP + 自定义注解，自动记录所有写操作，管理员可查看日志
- **软删除** — MyBatis-Plus `@TableLogic` 实现逻辑删除，删除操作不物理删除数据
- **数据库迁移** — Flyway 管理表结构版本，变更可追溯、可重放
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
│       ├── common/               通用类（RequestResult, JwtUtil, GlobalExceptionHandler, AOP切面）
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

### 方式一：Docker 起 MySQL + IDE 跑后端（推荐）

开发场景下推荐这种组合：MySQL 用容器免安装，后端在 IDEA / VSCode 里运行方便热重载和调试。

#### 1. 启动 MySQL

```bash
cd backend
docker compose up -d
```

默认只会启动 `mysql` 服务（监听 `localhost:3306`，用户名 / 密码 `root`/`root`，库名 `stumanage`）。`backend` 服务被放在 `full` profile 下，默认不启动。

#### 2. 启动后端

直接在 IDEA 中运行 `BackendApplication`，或在命令行执行：

```bash
cd backend
./mvnw spring-boot:run
```

Flyway 会在启动时自动建表 + 迁移，无需手动执行 SQL。

#### 3. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

- 后端：`http://localhost:28765`
- 接口文档：`http://localhost:28765/swagger-ui/index.html`
- 前端：`http://localhost:5173`

### 方式二：全 Docker 部署

适用于一键演示 / 部署，连后端也跑在容器里：

```bash
cd backend
docker compose --profile full up -d --build
```

常用命令：

```bash
docker compose logs -f backend           # 查看后端日志
docker compose --profile full down       # 停止全部服务
docker compose down -v                   # 停止并清除数据库数据
```

### 方式三：完全本地（不用 Docker）

需要自行安装 Java 17+、Node.js 18+、pnpm、MySQL 8+，并手动创建库：

```bash
mysql -uroot -p -e "CREATE DATABASE IF NOT EXISTS stumanage"
```

之后参考方式一的「启动后端」「启动前端」步骤。如数据库账号 / 端口不同，需相应修改 [backend/src/main/resources/application.yaml](backend/src/main/resources/application.yaml)。

### 初始账号

系统启动后会自动创建一个默认管理员账号：

| 用户名 | 密码 | 角色 |
| --- | --- | --- |
| `admin` | `admin123` | 管理员 |

> ⚠️ 首次登录后请立即在「个人中心 → 修改密码」处修改默认密码。`admin` 账号受系统保护，无法被删除或修改资料，仅允许修改密码。
>
> 其他用户可通过注册页面创建（默认角色为学生），由 `admin` 在用户管理中调整角色。
