package com.demo.employeeController;

import com.demo.employeeService.LeaveService;
import com.demo.entity.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<LeaveRequest>> applyLeave(@RequestBody LeaveRequest request, @PathVariable Long employeeId) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(leaveService.applyLeave(request, employeeId), "Leave request submitted"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<com.demo.dto.ApiResponse<LeaveRequest>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(leaveService.updateLeaveStatus(id, status), "Leave status updated"));
    }

    @GetMapping("/employee/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<LeaveRequest>>> getEmployeeLeaves(@PathVariable Long id) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(leaveService.getEmployeeLeaves(id), "Employee leaves retrieved"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<LeaveRequest>>> getPendingLeaves() {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(leaveService.getAllPendingLeaves(), "Pending leaves retrieved"));
    }

    @GetMapping("/on-leave")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<LeaveRequest>>> getOnLeaveToday(@RequestParam(required = false) String date) {
        java.time.LocalDate localDate = date != null ? java.time.LocalDate.parse(date) : java.time.LocalDate.now();
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(leaveService.getApprovedLeavesOnDate(localDate), "Personnel on leave retrieved"));
    }
}
