package com.studentmanager.model;

import lombok.Data;

@Data
public class MyClass {
    /**
     * 班级 ID
     */
    private Long id;
    /**
     * 部门 ID
     */
    private Long departmentId;
    /**
     * 班级名称
     */
    private String name;
    /**
     * 班级年纪 如 2024
     */
    private Integer grade;
}
