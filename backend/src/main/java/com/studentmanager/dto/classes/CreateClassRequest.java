package com.studentmanager.dto.classes;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateClassRequest {
    @Schema(description = "部门 ID")
    @NotNull(message = "部门 ID 不能为空")
    private Long departmentId;

    @Schema(description = "班级名称")
    @NotBlank(message = "班级名称不能为空")
    private String name;

    @Schema(description = "年纪", example = "2024")
    @NotNull(message = "班级年级不能为空")
    @Min(value = 1, message = "班级年级至少为 1")
    private Integer grade;
}
