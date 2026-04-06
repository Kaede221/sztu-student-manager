package com.studentmanager.dto.department;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateDepartmentRequest {
    @Schema(description = "部门ID")
    @NotNull(message = "部门 ID 不能为空")
    private Long id;

    @Schema(description = "部门名称")
    @NotBlank(message = "部门名称不能为空")
    private String name;

    @Schema(description = "部门描述")
    private String description;
}
