package com.studentmanager.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.OperationLog;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.classes.CreateClassRequest;
import com.studentmanager.dto.classes.UpdateClassRequest;
import com.studentmanager.model.MyClass;
import com.studentmanager.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "班级管理")
@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;

    @Operation(summary = "分页获取所有班级")
    @GetMapping("/list")
    public RequestResult<Page<MyClass>> getAllClasses(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        Page<MyClass> classPage = classService.page(new Page<>(page, size));
        return RequestResult.success(classPage);
    }

    @Operation(summary = "直接获取所有班级")
    @GetMapping("/listAll")
    public RequestResult<List<MyClass>> getAllClassesWithoutPage() {
        return RequestResult.success(classService.list());
    }

    @Operation(summary = "根据部门ID，分页获取对应部门的班级")
    @GetMapping("/list/{departmentId}")
    public RequestResult<Page<MyClass>> getClassesFromDepartment(@PathVariable Long departmentId, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<MyClass> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MyClass::getDepartmentId, departmentId);
        Page<MyClass> classPage = classService.page(new Page<>(page, size), wrapper);
        return RequestResult.success(classPage);
    }

    @OperationLog("增加班级")
    @Operation(summary = "增加新班级")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping
    public RequestResult<String> addNewClass(@Valid @RequestBody CreateClassRequest createClassRequest) {
        MyClass myClass = new MyClass();
        myClass.setName(createClassRequest.getName());
        myClass.setDepartmentId(createClassRequest.getDepartmentId());
        myClass.setGrade(createClassRequest.getGrade());

        boolean res = classService.save(myClass);
        return res ? RequestResult.success(null) : RequestResult.error("Err on Add New Class: " + myClass.toString());
    }

    @OperationLog("编辑班级")
    @Operation(summary = "编辑已有班级")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editClass(@Valid @RequestBody UpdateClassRequest updateClassRequest) {
        MyClass myClass = new MyClass();
        myClass.setId(updateClassRequest.getId());
        myClass.setGrade(updateClassRequest.getGrade());
        myClass.setDepartmentId(updateClassRequest.getDepartmentId());
        myClass.setName(updateClassRequest.getName());

        boolean res = classService.updateById(myClass);
        return res ? RequestResult.success(null) : RequestResult.error("Err on Update Class: " + myClass.toString());
    }

    @OperationLog("删除班级")
    @Operation(summary = "根据ID删除班级")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteClassById(@PathVariable Long id) {
        boolean res = classService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on remove ClassId: " + id);
    }
}
