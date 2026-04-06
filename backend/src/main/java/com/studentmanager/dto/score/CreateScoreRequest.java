package com.studentmanager.dto.score;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateScoreRequest {
    @Schema(description = "选课记录 ID")
    @NotNull(message = "选课记录不能为空")
    private Long enrollmentId;

    @Schema(description = "分数")
    @NotNull(message = "分数不能为空")
    @DecimalMin(value = "0", message = "分数最少为 0")
    @DecimalMax(value = "100", message = "分数最多为 100")
    private BigDecimal score;
}
