package com.studentmanager.common;

import com.studentmanager.model.MyOperationLog;
import com.studentmanager.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
public class OperationLogAspect {
    private final OperationLogService operationLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @AfterReturning("@annotation(com.studentmanager.common.OperationLog)")
    public void logOperation(JoinPoint joinPoint) {
        // 获取注解上的操作描述
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        OperationLog annotation = method.getAnnotation(OperationLog.class);

        // 获取当前登录的用户
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (authentication != null) ? authentication.getName() : "匿名";

        // 获取请求IP
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String ip = (attributes != null) ? attributes.getRequest().getRemoteAddr() : "未知";

        // 获取请求参数
        String params;
        try {
            params = objectMapper.writeValueAsString(joinPoint.getArgs());
        } catch (Exception e) {
            params = "参数序列化失败";
        }

        // 组装日志并保存
        MyOperationLog log = new MyOperationLog();
        log.setUsername(username);
        log.setOperation(annotation.value());
        log.setMethod(joinPoint.getTarget().getClass().getSimpleName() + "." + method.getName());
        log.setParams(params);
        log.setIp(ip);

        operationLogService.save(log);
    }
}
