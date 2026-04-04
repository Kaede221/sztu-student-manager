package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.JwtUtil;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.EditMeRequest;
import com.studentmanager.dto.LoginRequest;
import com.studentmanager.model.MyUser;
import com.studentmanager.model.UserRole;
import com.studentmanager.service.ClassService;
import com.studentmanager.service.DepartmentService;
import com.studentmanager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // 统计用Beans
    private final ClassService classService;
    private final DepartmentService departmentService;

    @GetMapping("/list")
    public RequestResult<Page<MyUser>> getUserList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String number,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) Boolean status
    ) {
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        if (username != null) wrapper.like(MyUser::getUsername, username);
        if (role != null) wrapper.eq(MyUser::getRole, role);
        if (number != null) wrapper.like(MyUser::getNumber, number);
        if (classId != null) wrapper.eq(MyUser::getClassId, classId);
        if (gender != null) wrapper.eq(MyUser::getGender, gender);
        if (phoneNumber != null) wrapper.like(MyUser::getPhoneNumber, phoneNumber);
        if (status != null) wrapper.eq(MyUser::getStatus, status);

        Page<MyUser> userPage = userService.page(new Page<>(page, size), wrapper);
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
        return RequestResult.error("Error on add user: " + user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editUser(@RequestBody MyUser user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty())
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        else
            user.setPassword(null);
        boolean res = userService.updateById(user);
        if (res) {
            return RequestResult.success(null);
        }
        return RequestResult.error("Error on update user: " + user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteUserById(@PathVariable Long id) {
        boolean res = userService.removeById(id);
        if (res) return RequestResult.success(null);
        return RequestResult.error("Error on delete userId: " + id);
    }

    /// ================================= 统计相关 ==================================== //

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/stats")
    public RequestResult<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();

        stats.put("userCount", userService.count());
        stats.put("classCount", classService.count());
        stats.put("departmentCount", departmentService.count());

        return RequestResult.success(stats);
    }

    /// ================================= 个人信息 ==================================== //

    @GetMapping("/me")
    public RequestResult<MyUser> getMyInfo(Authentication authentication) {
        String username = authentication.getName();

        // 查询用户
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyUser::getUsername, username);
        MyUser user = userService.getOne(wrapper);
        return RequestResult.success(user);
    }

    @PutMapping("/me")
    public RequestResult<String> editMyInfo(Authentication authentication, @RequestBody EditMeRequest editMeRequest) {
        String username = authentication.getName();
        LambdaQueryWrapper<MyUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyUser::getUsername, username);
        MyUser user = userService.getOne(wrapper);

        if (editMeRequest.getGender() != null)
            user.setGender(editMeRequest.getGender());
        if (editMeRequest.getPhoneNumber() != null)
            user.setPhoneNumber(editMeRequest.getPhoneNumber());

        boolean res = userService.updateById(user);
        return res ? RequestResult.success(null) : RequestResult.error("Err on Edit Your Profile");
    }

    ///  ================================= 登录相关 ================================== //

    @PostMapping("/register")
    public RequestResult<String> userRegister(@Valid @RequestBody LoginRequest request) {
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
    public RequestResult<String> userLogin(@Valid @RequestBody LoginRequest loginRequest) {
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
