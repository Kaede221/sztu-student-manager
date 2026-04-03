# CLAUDE.md — 学生管理系统

## 项目概述

学生信息管理平台（课设/练手项目），支持管理员、教师、学生三种角色，实现学生信息、课程、成绩的全流程管理。

## 技术栈

| 层     | 技术                                              |
| ------ | ------------------------------------------------- |
| 前端   | React 19 + TypeScript + Vite + (计划: Ant Design, Axios, React Router) |
| 后端   | Spring Boot 4 + Java 17 + Maven + (计划: MyBatis-Plus/JPA, Spring Security, JWT) |
| 数据库 | MySQL                                             |
| 工具   | EasyExcel, Lombok                                 |

## 项目结构

```
├── backend/          Spring Boot 后端
│   └── src/main/java/com/studentmanager/
├── frontend/         React + TypeScript 前端
│   └── src/
└── PATH.md           完整设计方案（角色、模块、数据库、接口、页面规划）
```

## 开发规范

- 包管理器：前端使用 pnpm，后端使用 Maven
- 前端启动：`cd frontend && pnpm dev`
- 后端启动：`cd backend && ./mvnw spring-boot:run`

## 协作约定

- **后端代码不主动编写**：除非用户多次明确要求，否则仅通过交流讨论来指导，不直接修改后端代码
- **教学优先**：用户遇到问题时，参考已有代码给出引导和建议，而非直接给出完整实现
- **设计方案参考**：详细的功能模块、数据库设计、接口规划见 [PATH.md](PATH.md)
