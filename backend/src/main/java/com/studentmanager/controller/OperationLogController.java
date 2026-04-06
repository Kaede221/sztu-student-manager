package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyOperationLog;
import com.studentmanager.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "日志管理")
@RestController
@RequestMapping("/api/log")
@RequiredArgsConstructor
public class OperationLogController {
    private final OperationLogService operationLogService;

    @Operation(summary = "分页获取日志信息")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public RequestResult<Page<MyOperationLog>> getLogsByPage(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<MyOperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(MyOperationLog::getCreatedAt);
        return RequestResult.success(operationLogService.page(new Page<>(page, size), wrapper));
    }
}
