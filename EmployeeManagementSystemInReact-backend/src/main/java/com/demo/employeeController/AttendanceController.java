package com.demo.employeeController;

import com.demo.employeeService.AttendanceService;
import com.demo.entity.Attendance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<?>> checkIn(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(com.demo.dto.ApiResponse.success(attendanceService.checkIn(id), "Clock-in successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.demo.dto.ApiResponse.error(e.getMessage(), "ATTENDANCE_ERROR"));
        }
    }

    @PostMapping("/check-out/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<?>> checkOut(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(com.demo.dto.ApiResponse.success(attendanceService.checkOut(id), "Clock-out successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(com.demo.dto.ApiResponse.error(e.getMessage(), "ATTENDANCE_ERROR"));
        }
    }

    @GetMapping("/employee/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<Attendance>>> getEmployeeAttendance(@PathVariable Long id) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(attendanceService.getEmployeeAttendance(id), "Attendance history retrieved"));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public ResponseEntity<com.demo.dto.ApiResponse<List<Attendance>>> getAllAttendance(@RequestParam String date) {
        return ResponseEntity.ok(com.demo.dto.ApiResponse.success(attendanceService.getAllAttendanceByDate(date), "Global attendance retrieved"));
    }
}
