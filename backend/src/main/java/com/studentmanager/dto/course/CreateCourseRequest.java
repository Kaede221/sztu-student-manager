package com.studentmanager.dto.course;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCourseRequest {
    /**
     * 课程名称
     */
    @NotBlank(message = "课程名称不能为空")
    private String name;
    /**
     * 学分
     */
    @NotNull(message = "学分不能为空")
    @Min(value = 1, message = "学分至少为 1")
    @Max(value = 8, message = "学分最多为 8")
    private Integer credit;
    /**
     * 授课教师 关联 user 表
     */
    @NotNull(message = "授课教师不能为空")
    private Long teacherId;
    /**
     * 课程容量
     */
    @NotNull(message = "课程容量不能为空")
    @Min(value = 1, message = "容量至少为 1")
    @Max(value = 100, message = "容量最大为 100")
    private Integer capacity;
    /**
     * 课程简介
     */
    private String description;
}
