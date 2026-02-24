package com.demo.employeeRepository;

import com.demo.entity.Attendance;
import com.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployee(Employee employee);
    List<Attendance> findByDate(LocalDate date);
    java.util.Optional<Attendance> findByEmployeeAndDate(Employee employee, LocalDate date);
}
