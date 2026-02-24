package com.demo.employeeService;

import com.demo.entity.LeaveRequest;
import java.util.List;

public interface LeaveService {
    LeaveRequest applyLeave(LeaveRequest request, Long employeeId);
    LeaveRequest updateLeaveStatus(Long leaveId, String status);
    List<LeaveRequest> getEmployeeLeaves(Long employeeId);
    List<LeaveRequest> getAllPendingLeaves();
    List<LeaveRequest> getApprovedLeavesOnDate(java.time.LocalDate date);
}
