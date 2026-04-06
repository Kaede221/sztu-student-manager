package com.studentmanager.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentmanager.common.RequestResult;
import com.studentmanager.dto.department.CreateDepartmentRequest;
import com.studentmanager.dto.department.UpdateDepartmentRequest;
import com.studentmanager.model.MyDepartment;
import com.studentmanager.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping("/list")
    public RequestResult<Page<MyDepartment>> getAllDepartments(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        Page<MyDepartment> departmentPage = departmentService.page(new Page<>(page, size));
        return RequestResult.success(departmentPage);
    }

    @GetMapping("/listAll")
    public RequestResult<List<MyDepartment>> getAllDepartmentWithoutPage() {
        return RequestResult.success(departmentService.list());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PostMapping
    public RequestResult<String> addDepartment(@Valid @RequestBody CreateDepartmentRequest createDepartmentRequest) {
        MyDepartment myDepartment = new MyDepartment();
        myDepartment.setDescription(createDepartmentRequest.getDescription());
        myDepartment.setName(createDepartmentRequest.getName());

        boolean res = departmentService.save(myDepartment);
        return res ? RequestResult.success(null) : RequestResult.error("Err on add department: " + myDepartment.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PutMapping
    public RequestResult<String> editDepartment(@Valid @RequestBody UpdateDepartmentRequest updateDepartmentRequest) {
        MyDepartment myDepartment = new MyDepartment();
        myDepartment.setName(updateDepartmentRequest.getName());
        myDepartment.setDescription(updateDepartmentRequest.getDescription());
        myDepartment.setId(updateDepartmentRequest.getId());

        boolean res = departmentService.updateById(myDepartment);
        return res ? RequestResult.success(null) : RequestResult.error("Err on edit department: " + myDepartment.toString());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public RequestResult<String> deleteDepartmentByid(@PathVariable Long id) {
        boolean res = departmentService.removeById(id);
        return res ? RequestResult.success(null) : RequestResult.error("Err on remove departmentId: " + id);
    }
}
