package com.studentmanager.controller;

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

    @GetMapping("/list")
    public List<MyUser> getUserList() {
        List<MyUser> users = userService.list();
        return users.stream().toList();
    }

    @GetMapping("/{id}")
    public MyUser getUserById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping
    public String addUser(@RequestBody MyUser user) {
        userService.save(user);
        return "Success";
    }

    @PutMapping
    public String editUser(@RequestBody MyUser user) {
        userService.updateById(user);
        return "Success";
    }

    @DeleteMapping("/{id}")
    public String deleteUserById(@PathVariable Long id) {
        userService.removeById(id);
        return "Success";
    }
}
