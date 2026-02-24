package com.demo.employeeService.ServiceImp;

import com.demo.employeeRepository.AttendanceRepository;
import com.demo.employeeRepository.EmployeeRepository;
import com.demo.employeeService.AttendanceService;
import com.demo.entity.Attendance;
import com.demo.entity.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private com.demo.employeeRepository.UserRepository userRepo;

    private Employee resolveEmployee(Long id) {
        // 1. Try direct ID match (for legacy support or direct links)
        Employee emp = employeeRepo.findById(id).orElse(null);
        if (emp != null) return emp;

        // 2. Map via User identity
        com.demo.entity.User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Identity not found for ID: " + id));

        // 3. Find by email
        return employeeRepo.findByEmail(user.getEmail()).orElseGet(() -> {
            // AUTO-REPAIR: If user exists but no employee profile, create it now
            Employee newEmp = new Employee();
            newEmp.setName(user.getUsername());
            newEmp.setEmail(user.getEmail());
            newEmp.setStatus("ACTIVE");
            newEmp.setJoiningDate(LocalDate.now());
            newEmp.setDepartment("General");
            newEmp.setDesignation("Employee");
            return employeeRepo.save(newEmp);
        });
    }

    @Override
    public Attendance checkIn(Long id) {
        Employee employee = resolveEmployee(id);
        
        if (attendanceRepo.findByEmployeeAndDate(employee, LocalDate.now()).isPresent()) {
            throw new RuntimeException("Already checked in for today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(LocalDate.now());
        attendance.setCheckIn(LocalTime.now());
        return attendanceRepo.save(attendance);
    }

    @Override
    public Attendance checkOut(Long id) {
        Employee employee = resolveEmployee(id);
        Attendance attendance = attendanceRepo.findByEmployeeAndDate(employee, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No check-in record found for today"));
        
        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Already checked out for today");
        }

        attendance.setCheckOut(LocalTime.now());
        Duration duration = Duration.between(attendance.getCheckIn(), attendance.getCheckOut());
        double hours = duration.toMinutes() / 60.0;
        attendance.setWorkingHours(hours);
        
        return attendanceRepo.save(attendance);
    }

    @Override
    public List<Attendance> getEmployeeAttendance(Long id) {
        Employee employee = resolveEmployee(id);
        return attendanceRepo.findByEmployee(employee);
    }

    @Override
    public List<Attendance> getAllAttendanceByDate(String date) {
        return attendanceRepo.findByDate(LocalDate.parse(date));
    }
}
