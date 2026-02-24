package com.demo.employeeRepository;

import com.demo.entity.Employee;
import com.demo.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    List<LeaveRequest> findByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findApprovedLeavesOnDate(java.time.LocalDate date);
}
