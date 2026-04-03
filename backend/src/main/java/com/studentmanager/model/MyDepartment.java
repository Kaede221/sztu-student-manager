package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("my_department")
public class MyDepartment {
    /**
     * 部门ID
     */
    @TableId(type = IdType.AUTO)
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
