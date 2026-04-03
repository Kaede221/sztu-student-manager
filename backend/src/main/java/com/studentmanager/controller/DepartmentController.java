package com.studentmanager.controller;

import com.studentmanager.common.RequestResult;
import com.studentmanager.model.MyDepartment;
import com.studentmanager.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping("/list")
    public RequestResult<List<MyDepartment>> getAllDepartments() {
        return RequestResult.success(departmentService.list());
    }

    @PostMapping
    public RequestResult<String> addDepartment(@RequestBody MyDepartment myDepartment) {
        boolean res = departmentService.save(myDepartment);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add department: " + myDepartment.toString());
    }

    @PutMapping
    public RequestResult<String> editDepartment(@RequestBody MyDepartment myDepartment) {
        boolean res = departmentService.updateById(myDepartment);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit department: " + myDepartment.toString());
    }

    @DeleteMapping("/{id}")
    public RequestResult<String> deleteDepartmentByid(@PathVariable Long id) {
        boolean res = departmentService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on remove departmentId: " + id);
    }
}
