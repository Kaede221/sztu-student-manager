package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.JwtUtil;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.LoginRequest;
import com.studentmanager.model.MyUser;
import com.studentmanager.model.UserRole;
import com.studentmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/list")
    public RequestResult<Page<MyUser>> getUserList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        Page<MyUser> userPage = userService.page(new Page<>(page, size));
        return RequestResult.success(userPage);
    }

    @GetMapping("/{id}")
    public RequestResult<MyUser> getUserById(@PathVariable Long id) {
        MyUser user = userService.getById(id);
        return user != null ? RequestResult.success(user) : RequestResult.error("User is not found");
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public RequestResult<String> addUser(@RequestBody MyUser user) {
        // 处理密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        boolean res = userService.save(user);
        if (res) {
            return RequestResult.success(null);
        }
        return RequestResult.error("Error on add user: " + user.toString());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editUser(@RequestBody MyUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        boolean res = userService.updateById(user);
        if (res) {
            return RequestResult.success(null);
        }
        return RequestResult.error("Error on update user: " + user.toString());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteUserById(@PathVariable Long id) {
        boolean res = userService.removeById(id);
        if (res) return RequestResult.success(null);
        return RequestResult.error("Error on delete userId: " + id);
    }

    ///  ================================= 登录相关 ================================== //

    @PostMapping("/register")
    public RequestResult<String> userRegister(@RequestBody LoginRequest request) {
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyUser::getUsername, request.getUsername());

        MyUser user = userService.getOne(wrapper);

        if (user == null) {
            user = new MyUser();
            user.setRole(UserRole.ROLE_STUDENT);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setUsername(request.getUsername());
            user.setStatus(true);

            userService.save(user);
            return RequestResult.success("Success");
        }
        return RequestResult.error("用户已存在");
    }

    @PostMapping("/login")
    public RequestResult<String> userLogin(@RequestBody LoginRequest loginRequest) {
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyUser::getUsername, loginRequest.getUsername());

        MyUser user = userService.getOne(wrapper);

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            return RequestResult.success(token);
        }
        return RequestResult.error("Not a user");
    }
}
