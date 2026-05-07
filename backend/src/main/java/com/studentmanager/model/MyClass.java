package com.studentmanager.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("my_class")
public class MyClass {
    /**
     * 班级 ID
     */
    @TableId(type = IdType.AUTO)
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
    /**
     * 是否被删除
     */
    @TableLogic
    private Integer deleted;
}
