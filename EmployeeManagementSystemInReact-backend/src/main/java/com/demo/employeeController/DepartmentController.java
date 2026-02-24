package com.demo.employeeController;

import com.demo.employeeService.DepartmentService;
import com.demo.entity.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.demo.dto.ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(departmentService.createDepartment(department), "Department created successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<Department>>> getAllDepartments() {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(departmentService.getAllDepartments(), "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<Department>> getDepartmentById(@PathVariable Long id) {
        Department dept = departmentService.getDepartmentById(id);
        if (dept == null) return ResponseEntity.status(404).body(com.demo.dto.ApiResponse.error("Department not found", "NOT_FOUND"));
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(dept, "Department retrieved successfully"));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.demo.dto.ApiResponse<Department>> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
        Department updated = departmentService.updateDepartment(id, department);
        if (updated == null) return ResponseEntity.status(404).body(com.demo.dto.ApiResponse.error("Department not found", "NOT_FOUND"));
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(updated, "Department updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.demo.dto.ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(null, "Department deleted successfully"));
    }
}
