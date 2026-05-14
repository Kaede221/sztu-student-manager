INSERT INTO my_user (username, password, role, status)
VALUES ('admin', '$2a$10$LnGL4sXn64Uc9J2QY07xze4HO8Az5SYU.B/poY.c.46IvVX.yp6d2', 'ROLE_ADMIN', 1)
ON DUPLICATE KEY UPDATE id = id;
