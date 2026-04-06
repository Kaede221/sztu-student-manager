package com.studentmanager.dto.department;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDepartmentRequest {
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
