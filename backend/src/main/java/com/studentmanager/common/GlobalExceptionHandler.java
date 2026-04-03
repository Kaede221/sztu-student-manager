package com.studentmanager.common;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public RequestResult<String> handleAccessDenine(AccessDeniedException e) {
        System.out.println(e.toString());
        return RequestResult.error("权限不足，请确认您的权限");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public RequestResult<String> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage())
                .findFirst()
                .orElse("参数错误");
        return RequestResult.error(msg);
    }

    @ExceptionHandler(Exception.class)
    public RequestResult<String> handleException(Exception e) {
        System.out.println(e.toString());
        return RequestResult.error("未知错误，请联系管理员");
    }
}
