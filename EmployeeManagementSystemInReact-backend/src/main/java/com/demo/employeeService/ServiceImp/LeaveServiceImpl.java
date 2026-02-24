package com.demo.employeeService.ServiceImp;

import com.demo.employeeRepository.EmployeeRepository;
import com.demo.employeeRepository.LeaveRepository;
import com.demo.employeeService.LeaveService;
import com.demo.entity.Employee;
import com.demo.entity.LeaveRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRepository leaveRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private com.demo.employeeRepository.UserRepository userRepo;

    private Employee resolveEmployee(Long id) {
        Employee emp = employeeRepo.findById(id).orElse(null);
        if (emp != null) return emp;

        com.demo.entity.User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Identity not found for ID: " + id));

        return employeeRepo.findByEmail(user.getEmail()).orElseGet(() -> {
            Employee newEmp = new Employee();
            newEmp.setName(user.getUsername());
            newEmp.setEmail(user.getEmail());
            newEmp.setStatus("ACTIVE");
            newEmp.setJoiningDate(java.time.LocalDate.now());
            newEmp.setDepartment("General");
            newEmp.setDesignation("Employee");
            return employeeRepo.save(newEmp);
        });
    }

    @Override
    public LeaveRequest applyLeave(LeaveRequest request, Long id) {
        Employee employee = resolveEmployee(id);
        request.setEmployee(employee);
        request.setStatus("PENDING");
        return leaveRepo.save(request);
    }

    @Override
    public LeaveRequest updateLeaveStatus(Long leaveId, String status) {
        LeaveRequest request = leaveRepo.findById(leaveId).orElseThrow();
        request.setStatus(status);
        return leaveRepo.save(request);
    }

    @Override
    public List<LeaveRequest> getEmployeeLeaves(Long id) {
        Employee employee = resolveEmployee(id);
        return leaveRepo.findByEmployee(employee);
    }

    @Override
    public List<LeaveRequest> getAllPendingLeaves() {
        return leaveRepo.findByStatus("PENDING");
    }

    @Override
    public List<LeaveRequest> getApprovedLeavesOnDate(java.time.LocalDate date) {
        return leaveRepo.findApprovedLeavesOnDate(date);
    }
}
