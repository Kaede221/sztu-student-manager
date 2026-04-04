# 学生信息管理系统 — 项目报告

## 一、项目概述

本项目是一个面向学校的 **学生信息管理平台**，采用前后端分离架构，支持 **管理员、教师、学生** 三种角色，实现了用户管理、院系班级管理、课程管理、选课管理、成绩管理等核心功能。

系统通过 JWT 实现无状态认证，结合 Spring Security 的方法级权限控制，确保不同角色只能访问其权限范围内的资源。

---

## 二、技术栈

| 层级   | 技术                                                                              |
| ------ | --------------------------------------------------------------------------------- |
| 前端   | React 19 + TypeScript + Vite + Ant Design 6 + Axios + React Router 7 + Recharts   |
| 后端   | Spring Boot 4 + Java 17 + Maven + MyBatis-Plus 3.5 + Spring Security + JWT (JJWT) |
| 数据库 | MySQL 8.0                                                                         |
| 工具   | Lombok、BCrypt 密码加密                                                           |
| 部署   | Docker + Docker Compose                                                           |

---

## 三、系统架构

### 3.1 整体架构

```
┌──────────────┐     HTTP/JSON     ┌──────────────────┐     JDBC     ┌─────────┐
│  React 前端  │  ◄──────────────► │  Spring Boot 后端 │ ◄──────────► │  MySQL  │
│  (Vite 开发) │   Bearer Token    │  (RESTful API)    │   MyBatis+  │         │
└──────────────┘                   └──────────────────┘              └─────────┘
```

### 3.2 后端分层结构

```
com.studentmanager
├── backend/          启动类
├── common/           公共组件（JWT工具、过滤器、统一响应、全局异常处理）
├── config/           配置类（Spring Security、MyBatis-Plus 分页插件）
├── controller/       控制器层（RESTful 接口）
├── dto/              数据传输对象（登录请求、修改密码请求等）
├── mapper/           持久层（MyBatis-Plus Mapper 接口）
├── model/            实体层（数据库表映射）
└── service/          业务逻辑层（接口 + 实现）
    └── impl/
```

### 3.3 前端目录结构

```
frontend/src
├── api/              API 请求模块（按资源划分）
├── pages/            页面组件
├── utils/            工具函数（认证、请求拦截）
├── App.tsx           路由配置
└── main.tsx          入口文件
```

---

## 四、数据库设计

### 4.1 E-R 关系

```
Department 1──N Class
User N──1 Class (学生归属班级)
User 1──N Course (教师授课)
User N──M Course (通过 Enrollment 选课)
Enrollment 1──1 Score (成绩)
```

### 4.2 数据表结构

**用户表 (my_user)**

| 字段         | 类型         | 约束                        | 说明                |
| ------------ | ------------ | --------------------------- | ------------------- |
| id           | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | 主键                |
| username     | VARCHAR(100) | UNIQUE, NOT NULL            | 用户名              |
| password     | VARCHAR(255) | NOT NULL                    | 密码（BCrypt 加密） |
| role         | VARCHAR(20)  | DEFAULT 'STUDENT'           | 角色                |
| number       | VARCHAR(50)  | UNIQUE                      | 学工号              |
| class_id     | BIGINT       |                             | 班级 ID             |
| gender       | VARCHAR(50)  |                             | 性别                |
| phone_number | VARCHAR(20)  |                             | 手机号              |
| status       | TINYINT      | DEFAULT 0                   | 账号状态            |

**院系表 (my_department)**

| 字段        | 类型         | 约束                        | 说明   |
| ----------- | ------------ | --------------------------- | ------ |
| id          | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | 主键   |
| name        | VARCHAR(100) | NOT NULL                    | 院系名 |
| description | VARCHAR(100) | NOT NULL                    | 描述   |

**班级表 (my_class)**

| 字段          | 类型         | 约束                        | 说明    |
| ------------- | ------------ | --------------------------- | ------- |
| id            | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | 主键    |
| department_id | BIGINT       | NOT NULL                    | 院系 ID |
| name          | VARCHAR(100) | NOT NULL                    | 班级名  |
| grade         | INT          | NOT NULL                    | 年级    |

**课程表 (my_course)**

| 字段        | 类型         | 约束                        | 说明     |
| ----------- | ------------ | --------------------------- | -------- |
| id          | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | 主键     |
| name        | VARCHAR(100) | NOT NULL                    | 课程名   |
| credit      | INT          | NOT NULL, DEFAULT 1         | 学分     |
| teacher_id  | BIGINT       | NOT NULL                    | 教师 ID  |
| capacity    | INT          | NOT NULL, DEFAULT 50        | 课程容量 |
| description | VARCHAR(200) |                             | 课程简介 |

**选课表 (my_enrollment)**

| 字段       | 类型         | 约束                         | 说明     |
| ---------- | ------------ | ---------------------------- | -------- |
| id         | BIGINT       | PRIMARY KEY, AUTO_INCREMENT  | 主键     |
| student_id | BIGINT       | NOT NULL                     | 学生 ID  |
| course_id  | BIGINT       | NOT NULL                     | 课程 ID  |
| status     | VARCHAR(100) | NOT NULL, DEFAULT 'ENROLLED' | 选课状态 |

**成绩表 (my_score)**

| 字段          | 类型          | 约束                        | 说明        |
| ------------- | ------------- | --------------------------- | ----------- |
| id            | BIGINT        | PRIMARY KEY, AUTO_INCREMENT | 主键        |
| enrollment_id | BIGINT        | NOT NULL                    | 选课记录 ID |
| score         | DECIMAL(5, 2) | NOT NULL                    | 分数        |

---

## 五、核心功能实现

### 5.1 JWT 认证机制

系统采用 JWT（JSON Web Token）实现无状态认证，认证流程如下：

```
用户登录 → 服务端验证密码 → 生成 JWT Token → 返回给前端
前端请求 → 携带 Token 于请求头 → JWT 过滤器解析验证 → 放行或拒绝
```

**JWT 工具类 — 负责 Token 的生成与解析：**

```java
@Component
public class JwtUtil {
    private final String SECRET = "MySecretKeyMySecretKeyMySecretKey123";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
    private final long EXPIRATION = 1000 * 60 * 60 * 2; // 2小时过期

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
```

**JWT 过滤器 — 拦截每个请求，从请求头提取并验证 Token：**

```java
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            authorizationHeader = authorizationHeader.substring(7);
            if (!jwtUtil.isExpired(authorizationHeader)) {
                String role = jwtUtil.parseToken(authorizationHeader).get("role", String.class);
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        jwtUtil.getUsername(authorizationHeader), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(token);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### 5.2 Spring Security 配置

通过 `SecurityFilterChain` 配置安全策略，实现 CSRF 关闭、CORS 跨域、无状态会话、JWT 过滤器注入：

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity security) {
        security.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(req -> {
                    var config = new CorsConfiguration();
                    config.addAllowedOriginPattern("*");
                    config.addAllowedMethod("*");
                    config.addAllowedHeader("*");
                    config.setAllowCredentials(true);
                    return config;
                }))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/user/login").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(c -> c.disable())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return security.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 5.3 角色权限控制

使用 `@PreAuthorize` 注解实现方法级权限控制：

```java
// 仅管理员可以操作用户
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@PostMapping
public RequestResult<String> addUser(@RequestBody MyUser user) { ... }

// 管理员和教师都可以操作课程
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_TEACHER')")
@PostMapping
public RequestResult<String> addCourse(@RequestBody MyCourse course) { ... }

// 仅学生可以选课
@PreAuthorize("hasAuthority('ROLE_STUDENT')")
@PostMapping("/enroll/{courseId}")
public RequestResult<String> studentEnroll(...) { ... }
```

各角色权限分配：

| 功能模块     | 管理员    | 教师         | 学生         |
| ------------ | --------- | ------------ | ------------ |
| 用户管理     | 增删改查  | 查看         | 无           |
| 院系管理     | 增删改查  | 查看         | 无           |
| 班级管理     | 增删改查  | 查看         | 无           |
| 课程管理     | 增删改查  | 增删改查     | 无           |
| 选课管理     | 无        | 查看选课名单 | 选课/退课    |
| 成绩管理     | 录入/修改 | 录入/修改    | 查看自己成绩 |
| 个人信息     | 查看/修改 | 查看/修改    | 查看/修改    |
| 数据统计看板 | 查看      | 无           | 无           |

### 5.4 统一响应格式

所有接口返回统一的 `RequestResult<T>` 结构，便于前端统一处理：

```java
@Data
public class RequestResult<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> RequestResult<T> success(T data) {
        RequestResult<T> result = new RequestResult<>();
        result.setCode(200);
        result.setMessage("Success");
        result.setData(data);
        return result;
    }

    public static <T> RequestResult<T> error(String message) {
        RequestResult<T> result = new RequestResult<>();
        result.setCode(400);
        result.setMessage(message);
        result.setData(null);
        return result;
    }
}
```

返回示例：

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "admin",
    "role": "ROLE_ADMIN",
    "status": true
  }
}
```

### 5.5 全局异常处理

通过 `@RestControllerAdvice` 统一捕获异常，保证前端始终收到一致的 JSON 响应：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public RequestResult<String> handleAccessDenine(AccessDeniedException e) {
        return RequestResult.error("权限不足，请确认您的权限");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public RequestResult<String> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage())
                .findFirst()
                .orElse("参数错误");
        return RequestResult.error(msg);
    }

    @ExceptionHandler(Exception.class)
    public RequestResult<String> handleException(Exception e) {
        return RequestResult.error("未知错误，请联系管理员");
    }
}
```

### 5.6 实体类与 MyBatis-Plus 注解

以用户实体为例，展示 MyBatis-Plus 的注解使用：

```java
@Data
@TableName("my_user")
public class MyUser {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // 密码不返回给前端
    private String password;

    private UserRole role;     // 枚举类型，自动映射
    private String number;     // 学工号
    private Long classId;      // 班级 ID
    private String gender;     // 性别
    private String phoneNumber;// 手机号
    private Boolean status;    // 账号状态
}
```

Mapper 接口只需继承 `BaseMapper` 即可拥有完整的 CRUD 能力：

```java
@Mapper
public interface UserMapper extends BaseMapper<MyUser> {
}
```

### 5.7 选课功能（业务逻辑示例）

选课接口是本系统中业务逻辑最复杂的部分，需要校验课程存在性、重复选课、课程容量：

```java
@PreAuthorize("hasAuthority('ROLE_STUDENT')")
@PostMapping("/enroll/{courseId}")
public RequestResult<String> studentEnroll(@PathVariable Long courseId, Authentication authentication) {
    // 1. 获取当前登录用户
    String username = authentication.getName();
    MyUser user = userService.getOne(
            new LambdaQueryWrapper<MyUser>().eq(MyUser::getUsername, username));

    // 2. 校验课程是否存在
    MyCourse course = courseService.getById(courseId);
    if (course == null) {
        return RequestResult.error("课程不存在，请重试：" + courseId);
    }

    // 3. 校验是否已选该课程
    MyEnrollment existing = enrollmentService.getOne(
            new LambdaQueryWrapper<MyEnrollment>()
                    .eq(MyEnrollment::getStudentId, user.getId())
                    .eq(MyEnrollment::getCourseId, courseId)
                    .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED));
    if (existing != null) {
        return RequestResult.error("您已选择当前课程");
    }

    // 4. 校验课程容量
    long count = enrollmentService.count(
            new LambdaQueryWrapper<MyEnrollment>()
                    .eq(MyEnrollment::getCourseId, courseId)
                    .eq(MyEnrollment::getStatus, EnrollmentStatus.ENROLLED));
    if (count >= course.getCapacity()) {
        return RequestResult.error("课程已满");
    }

    // 5. 创建选课记录
    MyEnrollment enrollment = new MyEnrollment();
    enrollment.setStudentId(user.getId());
    enrollment.setCourseId(courseId);
    enrollment.setStatus(EnrollmentStatus.ENROLLED);
    enrollmentService.save(enrollment);

    return RequestResult.success("选课成功");
}
```

退课采用逻辑删除（将状态改为 `DROPPED`），而非物理删除，保留历史记录：

```java
enrollment.setStatus(EnrollmentStatus.DROPPED);
enrollmentService.updateById(enrollment);
```

### 5.8 分页与动态查询

使用 MyBatis-Plus 的 `Page` 和 `LambdaQueryWrapper` 实现分页查询与多条件动态筛选：

```java
@GetMapping("/list")
public RequestResult<Page<MyUser>> getUserList(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String username,
        @RequestParam(required = false) String role,
        @RequestParam(required = false) String number,
        @RequestParam(required = false) Long classId,
        @RequestParam(required = false) String gender,
        @RequestParam(required = false) String phoneNumber,
        @RequestParam(required = false) Boolean status
) {
    LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
    if (username != null) wrapper.like(MyUser::getUsername, username);  // 模糊搜索
    if (role != null) wrapper.eq(MyUser::getRole, role);               // 精确匹配
    if (number != null) wrapper.like(MyUser::getNumber, number);
    if (classId != null) wrapper.eq(MyUser::getClassId, classId);
    if (gender != null) wrapper.eq(MyUser::getGender, gender);
    if (phoneNumber != null) wrapper.like(MyUser::getPhoneNumber, phoneNumber);
    if (status != null) wrapper.eq(MyUser::getStatus, status);

    Page<MyUser> userPage = userService.page(new Page<>(page, size), wrapper);
    return RequestResult.success(userPage);
}
```

分页插件需要在配置类中注册：

```java
@Configuration
public class MyBatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

### 5.9 密码安全

- **存储加密**：使用 BCrypt 算法加密存储，不存明文密码
- **密码脱敏**：通过 `@JsonProperty(access = Access.WRITE_ONLY)` 确保密码字段不会出现在 API 响应中
- **登录验证**：使用 `passwordEncoder.matches()` 比对明文与密文
- **修改密码**：需要验证旧密码正确后才能设置新密码

```java
// 登录时验证密码
if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
    String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    return RequestResult.success(token);
}

// 修改密码时先验证旧密码
if (passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userService.updateById(user);
    return RequestResult.success("密码修改成功");
}
```

### 5.10 前端请求拦截

前端通过 Axios 拦截器自动附加 Token，并统一处理响应错误：

```typescript
// 请求拦截器：自动附加 JWT Token
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
request.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code !== 200) {
    message.error(res.message || '请求失败');
    return Promise.reject(res);
  }
  return res;
}, (error) => {
  if (error.response?.status === 401) {
    removeToken();
    window.location.href = '/login';
  }
});
```

---

## 六、API 接口一览

### 6.1 认证相关（无需 Token）

| 方法 | 路径               | 说明     |
| ---- | ------------------ | -------- |
| POST | /api/user/login    | 用户登录 |
| POST | /api/user/register | 用户注册 |

### 6.2 用户管理（需认证）

| 方法   | 路径               | 说明           | 权限  |
| ------ | ------------------ | -------------- | ----- |
| GET    | /api/user/list     | 用户列表(分页) | 登录  |
| GET    | /api/user/{id}     | 查询单个用户   | 登录  |
| POST   | /api/user          | 新增用户       | ADMIN |
| PUT    | /api/user          | 修改用户       | ADMIN |
| DELETE | /api/user/{id}     | 删除用户       | ADMIN |
| GET    | /api/user/me       | 获取个人信息   | 登录  |
| PUT    | /api/user/me       | 修改个人信息   | 登录  |
| PUT    | /api/user/password | 修改密码       | 登录  |
| GET    | /api/user/stats    | 数据统计       | ADMIN |

### 6.3 院系管理

| 方法   | 路径                    | 说明     | 权限  |
| ------ | ----------------------- | -------- | ----- |
| GET    | /api/department/list    | 院系列表 | 登录  |
| GET    | /api/department/listAll | 全部院系 | 登录  |
| POST   | /api/department         | 新增院系 | ADMIN |
| PUT    | /api/department         | 修改院系 | ADMIN |
| DELETE | /api/department/{id}    | 删除院系 | ADMIN |

### 6.4 班级管理

| 方法   | 路径                           | 说明         | 权限  |
| ------ | ------------------------------ | ------------ | ----- |
| GET    | /api/class/list                | 班级列表     | 登录  |
| GET    | /api/class/listAll             | 全部班级     | 登录  |
| GET    | /api/class/list/{departmentId} | 按院系查班级 | 登录  |
| POST   | /api/class                     | 新增班级     | ADMIN |
| PUT    | /api/class                     | 修改班级     | ADMIN |
| DELETE | /api/class/{id}                | 删除班级     | ADMIN |

### 6.5 课程管理

| 方法   | 路径             | 说明     | 权限            |
| ------ | ---------------- | -------- | --------------- |
| GET    | /api/course/list | 课程列表 | 登录            |
| POST   | /api/course      | 新增课程 | ADMIN / TEACHER |
| PUT    | /api/course      | 修改课程 | ADMIN / TEACHER |
| DELETE | /api/course/{id} | 删除课程 | ADMIN / TEACHER |

### 6.6 选课管理

| 方法 | 路径                              | 说明         | 权限            |
| ---- | --------------------------------- | ------------ | --------------- |
| POST | /api/enrollment/enroll/{courseId} | 选课         | STUDENT         |
| POST | /api/enrollment/drop/{courseId}   | 退课         | STUDENT         |
| GET  | /api/enrollment/my                | 我的选课     | STUDENT         |
| GET  | /api/enrollment/list/{courseId}   | 课程选课名单 | ADMIN / TEACHER |

### 6.7 成绩管理

| 方法 | 路径                       | 说明         | 权限            |
| ---- | -------------------------- | ------------ | --------------- |
| POST | /api/score                 | 录入成绩     | ADMIN / TEACHER |
| PUT  | /api/score                 | 修改成绩     | ADMIN / TEACHER |
| GET  | /api/score/my              | 查看我的成绩 | STUDENT         |
| GET  | /api/score/list/{courseId} | 查看课程成绩 | ADMIN / TEACHER |

---

## 七、前端页面说明

### 7.1 登录/注册页

支持登录和注册两种模式的 Tab 切换，注册默认创建学生角色用户。

### 7.2 首页仪表盘 (Dashboard)

- **所有用户**：展示个人信息、支持修改性别和手机号、支持修改密码
- **管理员额外**：展示数据统计卡片（用户总数、学生数、教师数、课程数、院系数、选课人次）+ 用户角色分布饼图（Recharts）

### 7.3 用户管理

支持多条件搜索筛选（用户名、角色、学工号、班级、性别、手机号、状态），分页展示，管理员可执行增删改操作。

### 7.4 院系 / 班级管理

标准 CRUD 页面，班级管理支持按院系筛选。新增/编辑时使用下拉选择器关联院系。

### 7.5 课程管理

课程列表展示课程信息，新增/编辑时通过下拉选择器关联授课教师。

### 7.6 选课中心（学生）

展示所有可选课程及当前选课状态，支持一键选课/退课操作。

### 7.7 成绩查询

- **学生视图**：查看自己所有课程成绩，成绩按分数段用不同颜色标注
- **教师/管理员视图**：选择课程后查看该课程所有选课学生及成绩，支持录入和修改成绩

---

## 八、安全机制

| 安全措施     | 实现方式                                                   |
| ------------ | ---------------------------------------------------------- |
| 认证机制     | JWT Token，2 小时过期，无状态                              |
| 密码安全     | BCrypt 加密存储，API 响应中不返回密码字段                  |
| 权限控制     | Spring Security + `@PreAuthorize` 方法级注解               |
| 跨域保护     | CORS 配置允许前端域名访问                                  |
| 参数校验     | `@Valid` + `@NotBlank` / `@Size` 注解校验入参              |
| 全局异常处理 | `@RestControllerAdvice` 统一捕获异常，避免暴露系统内部信息 |
| 注册安全     | 注册时角色固定为 STUDENT，不允许用户自行指定角色           |

---

## 九、启动与使用

### 9.1 环境要求

- JDK 17+
- Node.js 18+
- MySQL 8.0
- pnpm
- Maven

### 9.2 数据库初始化

```sql
CREATE DATABASE stumanage;
USE stumanage;

-- 执行建表语句（见 backend/db/init.sql）
```

### 9.3 启动后端

```bash
cd backend
./mvnw spring-boot:run
```

后端将在 `http://localhost:8080` 启动。

### 9.4 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

前端将在 `http://localhost:5173` 启动。

### 9.5 Docker 部署（可选）

```bash
cd backend
docker compose up -d --build
```

---

## 十、总结

本系统实现了一个完整的学生信息管理平台，涵盖了用户认证、权限控制、信息管理、选课管理、成绩管理等核心功能。通过前后端分离的架构设计和 RESTful API 规范，系统具有良好的可维护性和可扩展性。

### 技术亮点

1. **JWT 无状态认证**：避免服务端存储 Session，适合分布式部署
2. **方法级权限控制**：通过 `@PreAuthorize` 注解实现细粒度的角色权限管理
3. **MyBatis-Plus 动态查询**：利用 `LambdaQueryWrapper` 实现类型安全的动态条件构建
4. **统一响应与异常处理**：保证前后端交互格式一致，提升开发效率
5. **密码安全机制**：BCrypt 加密 + 密码脱敏双重保障
6. **选课容量控制**：在选课接口中实现了课程容量校验，防止超额选课
7. **Docker 一键部署**：通过 Docker Compose 编排后端与数据库，简化部署流程
