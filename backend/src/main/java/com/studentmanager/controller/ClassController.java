package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyClass;
import com.studentmanager.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;

    @GetMapping("/list")
    public RequestResult<List<MyClass>> getAllClasses() {
        return RequestResult.success(classService.list());
    }

    @GetMapping("/list/{departmentId}")
    public RequestResult<List<MyClass>> getClassesFromDepartment(@PathVariable Long departmentId) {
        LambdaQueryWrapper<MyClass> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyClass::getDepartmentId, departmentId);
        List<MyClass> classes = classService.list(wrapper);

        return RequestResult.success(classes);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping
    public RequestResult<String> addNewClass(@RequestBody MyClass myClass) {
        boolean res = classService.save(myClass);
        return res ? RequestResult.success(null) : RequestResult.error("Err on Add New Class: " + myClass.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editClass(@RequestBody MyClass myClass) {
        boolean res = classService.updateById(myClass);
        return res ? RequestResult.success(null) : RequestResult.error("Err on Update Class: " + myClass.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteClassById(@PathVariable Long id) {
        boolean res = classService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on remove ClassId: " + id);
    }
}
