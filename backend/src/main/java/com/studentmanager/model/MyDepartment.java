package com.studentmanager.model;

import lombok.Data;

@Data
public class MyDepartment {
    /**
     * 部门ID
     */
    private Long id;
    /**
     * 部门名称
     */
    private String name;
    /**
     * 部门描述
     */
    private String description;
}
