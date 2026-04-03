package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studentmanager.common.JwtUtil;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.LoginRequest;
import com.studentmanager.model.MyUser;
import com.studentmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/list")
    public RequestResult<List<MyUser>> getUserList() {
        List<MyUser> users = userService.list();
        return RequestResult.success(users);
    }

    @GetMapping("/{id}")
    public RequestResult<MyUser> getUserById(@PathVariable Long id) {
        MyUser user = userService.getById(id);
        return user != null ? RequestResult.success(user) : RequestResult.error("User is not found");
    }

    @PostMapping
    public RequestResult<String> addUser(@RequestBody MyUser user) {
        boolean res = userService.save(user);
        if (res) {
            return RequestResult.success(null);
        }
        return RequestResult.error("Error on add user: " + user.toString());
    }

    @PutMapping
    public RequestResult<String> editUser(@RequestBody MyUser user) {
        boolean res = userService.updateById(user);
        if (res) {
            return RequestResult.success(null);
        }
        return RequestResult.error("Error on update user: " + user.toString());
    }

    @DeleteMapping("/{id}")
    public RequestResult<String> deleteUserById(@PathVariable Long id) {
        boolean res = userService.removeById(id);
        if (res) return RequestResult.success(null);
        return RequestResult.error("Error on delete userId: " + id);
    }

    ///  ================================= 登录相关 ================================== //

    @PostMapping("/login")
    public RequestResult<String> userLogin(@RequestBody LoginRequest loginRequest) {
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyUser::getUsername, loginRequest.getUsername());

        MyUser user = userService.getOne(wrapper);

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            return RequestResult.success(token);
        }
        return RequestResult.error("Not a user");
    }
}
