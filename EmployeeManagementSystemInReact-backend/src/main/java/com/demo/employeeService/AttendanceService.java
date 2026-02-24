package com.demo.employeeService;

import com.demo.entity.Attendance;
import java.util.List;

public interface AttendanceService {
    Attendance checkIn(Long employeeId);
    Attendance checkOut(Long employeeId);
    List<Attendance> getEmployeeAttendance(Long employeeId);
    List<Attendance> getAllAttendanceByDate(String date);
}
