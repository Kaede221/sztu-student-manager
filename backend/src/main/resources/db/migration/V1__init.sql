CREATE TABLE IF NOT EXISTS my_user
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    username     VARCHAR(100) UNIQUE NOT NULL,
    password     VARCHAR(255)        NOT NULL,
    role         VARCHAR(20) DEFAULT 'ROLE_STUDENT',
    status       TINYINT     DEFAULT 1,
    number       VARCHAR(50) UNIQUE,
    class_id     BIGINT,
    gender       VARCHAR(50) DEFAULT 'MAN',
    phone_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS my_department
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS my_class
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    department_id BIGINT       NOT NULL,
    name          VARCHAR(100) NOT NULL,
    grade         INT          NOT NULL
);

CREATE TABLE IF NOT EXISTS my_course
(
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL DEFAULT '默认课程',
    credit      INT          NOT NULL DEFAULT 1,
    teacher_id  BIGINT       NOT NULL,
    capacity    INT          NOT NULL DEFAULT 50,
    description VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS my_enrollment
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT                          NOT NULL,
    course_id  BIGINT                          NOT NULL,
    status     VARCHAR(100) DEFAULT 'ENROLLED' NOT NULL
);

CREATE TABLE IF NOT EXISTS my_score
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id BIGINT        NOT NULL,
    score         DECIMAL(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS my_operation_log
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    username   VARCHAR(100) NOT NULL COMMENT '操作用户',
    operation  VARCHAR(200) NOT NULL COMMENT '操作描述',
    method     VARCHAR(200) NOT NULL COMMENT '请求方法',
    params     TEXT COMMENT '请求参数',
    ip         VARCHAR(50) COMMENT '请求IP',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间'
);
