package com.studentmanager.common;

import lombok.Data;

@Data
public class RequestResult<T> {
    /**
     * 状态码
     */
    private Integer code;
    /**
     * 响应信息
     */
    private String message;
    /**
     * 响应返回的数据
     */
    private T data;

    /**
     * 快捷成功
     */
    public static <T> RequestResult<T> success(T data) {
        RequestResult<T> result = new RequestResult<T>();
        result.setCode(200);
        result.setMessage("Success");
        result.setData(data);

        return result;
    }

    public static <T> RequestResult<T> error(String message) {
        RequestResult<T> result = new RequestResult<T>();
        result.setCode(400);
        result.setMessage(message);
        result.setData(null);
        return result;
    }
}
