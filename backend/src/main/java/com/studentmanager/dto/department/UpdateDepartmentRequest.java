package com.studentmanager.dto.department;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDepartmentRequest {
    /**
     * 部门ID
     */
    @NotNull(message = "部门 ID 不能为空")
    private Long id;
    /**
     * 部门名称
     */
    @NotBlank(message = "部门名称不能为空")
    private String name;
    /**
     * 部门描述
     */
    private String description;
}
