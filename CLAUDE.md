# CLAUDE.md — 学生管理系统

## 项目概述

学生信息管理平台（课设/练手项目），支持管理员、教师、学生三种角色，实现学生信息、课程、成绩的全流程管理。

## 技术栈

| 层     | 技术                                              |
| ------ | ------------------------------------------------- |
| 前端   | React 19 + TypeScript + Vite + Ant Design 6 + Axios + React Router |
| 后端   | Spring Boot 4 + Java 17 + Maven + MyBatis-Plus + Spring Security + JWT |
| 数据库 | MySQL                                             |
| 工具   | Lombok                                            |

## 项目结构

```
├── backend/          Spring Boot 后端
│   └── src/main/java/com/studentmanager/
├── frontend/         React + TypeScript 前端
│   └── src/
└── README.md         项目说明文档
```

## 开发规范

- 包管理器：前端使用 pnpm，后端使用 Maven
- 前端启动：`cd frontend && pnpm dev`
- 后端启动：`cd backend && ./mvnw spring-boot:run`

## 协作约定

- **后端代码不主动编写**：除非用户多次明确要求，否则仅通过交流讨论来指导，不直接修改后端代码
- **教学优先**：用户遇到问题时，参考已有代码给出引导和建议，而非直接给出完整实现
- **项目文档参考**：功能概览、建表语句、启动方式见 [README.md](README.md)
