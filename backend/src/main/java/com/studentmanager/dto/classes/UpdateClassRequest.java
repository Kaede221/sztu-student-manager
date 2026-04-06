package com.studentmanager.dto.classes;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateClassRequest {
    /**
     * 唯一 ID
     */
    @NotNull(message = "班级 ID 不能为空")
    private Long id;
    /**
     * 部门 ID
     */
    @NotNull(message = "部门 ID 不能为空")
    private Long departmentId;
    /**
     * 班级名称
     */
    @NotBlank(message = "班级名称不能为空")
    private String name;
    /**
     * 班级年纪 如 2024
     */
    @NotNull(message = "班级年级不能为空")
    @Min(value = 1, message = "班级年级至少为 1")
    private Integer grade;
}
