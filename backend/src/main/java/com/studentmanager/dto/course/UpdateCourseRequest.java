package com.studentmanager.dto.course;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCourseRequest {
    @Schema(description = "课程 ID")
    @NotNull(message = "课程 ID 不能为空")
    private Long id;

    @Schema(description = "课程名称")
    @NotBlank(message = "课程名称不能为空")
    private String name;

    @Schema(description = "学分")
    @NotNull(message = "学分不能为空")
    @Min(value = 1, message = "学分至少为 1")
    @Max(value = 8, message = "学分最多为 8")
    private Integer credit;

    @Schema(description = "授课教师 ID")
    @NotNull(message = "授课教师不能为空")
    private Long teacherId;

    @Schema(description = "课程容量")
    @NotNull(message = "课程容量不能为空")
    @Min(value = 1, message = "容量至少为 1")
    @Max(value = 100, message = "容量最大为 100")
    private Integer capacity;

    @Schema(description = "课程简介")
    private String description;
}
