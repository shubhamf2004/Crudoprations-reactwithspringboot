package com.demo.employeeController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.employeeService.EmployeeService;
import com.demo.entity.Employee;

import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class EmpController {

	@Autowired
	EmployeeService serv;
	
	
	
	@PostMapping("/employee")
    public ResponseEntity<com.demo.dto.ApiResponse<Employee>> postEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = serv.postEmployee(employee);
        return new ResponseEntity<>(com.demo.dto.ApiResponse.success(savedEmployee, "Employee registered successfully"), HttpStatus.CREATED);
    }
	
	@GetMapping("/getEmployee")
	public ResponseEntity<com.demo.dto.ApiResponse<List<Employee>>> getAllEmployees(){
		 return ResponseEntity.ok(com.demo.dto.ApiResponse.success(serv.getAllEmployee(), "Employees retrieved successfully"));
	}
	
	@DeleteMapping("/employee/{id}")
	public ResponseEntity<com.demo.dto.ApiResponse<String>> deleteEmployee(@PathVariable Long id){
		serv.deleteEmployee(id);
		return ResponseEntity.ok(com.demo.dto.ApiResponse.success(null, "Employee with id " + id + " deleted successfully"));
	}
	
	@GetMapping("/employee/{id}")
	public ResponseEntity<com.demo.dto.ApiResponse<Employee>> getEmployee(@PathVariable long id){
		Employee emp=serv.getEmployee(id);
		if(emp==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(com.demo.dto.ApiResponse.error("Employee not found", "NOT_FOUND"));
		return ResponseEntity.ok(com.demo.dto.ApiResponse.success(emp, "Employee retrieved successfully"));	
	}
	
	@PatchMapping("/employee/{id}")
     public ResponseEntity<com.demo.dto.ApiResponse<Employee>> updateEmployee(@RequestBody Employee employee ,@PathVariable Long id) {
		Employee updateEmployee=serv.updateEmployee(employee,id);
		 if(updateEmployee==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(com.demo.dto.ApiResponse.error("Update failed", "UPDATE_ERROR"));
		 return ResponseEntity.ok(com.demo.dto.ApiResponse.success(updateEmployee, "Employee profile updated successfully"));	
	}

	@Autowired
	private com.demo.employeeRepository.LeaveRepository leaveRepo;

	@Autowired
	private com.demo.employeeRepository.AttendanceRepository attendanceRepo;

	@Autowired
	private com.demo.employeeRepository.UserRepository userRepo;

	@GetMapping("/dashboard/stats")
	@PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
	public ResponseEntity<?> getDashboardStats() {
		java.util.Map<String, Object> stats = new java.util.HashMap<>();
		List<java.util.Map<String, String>> activities = new java.util.ArrayList<>();
		
		String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("StatsRequest: User " + email + " requesting stats");
		
		Employee employee = serv.getAllEmployee().stream()
				.filter(e -> e.getEmail().equals(email))
				.findFirst().orElse(null);
		
		if (employee == null) {
			System.out.println("StatsRequest: No employee record found for " + email);
		} else {
			System.out.println("StatsRequest: Found employee ID " + employee.getId() + " for " + email);
		}

		boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
				.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_HR"));
		System.out.println("StatsRequest: User admin status: " + isAdmin);

		if (isAdmin) {
			List<Employee> employees = serv.getAllEmployee();
			long total = employees.size();
			long active = employees.stream()
					.filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus()))
					.count();
			long pendingLeaves = leaveRepo.findByStatus("PENDING").size();
			List<com.demo.entity.LeaveRequest> onLeaveToday = leaveRepo.findApprovedLeavesOnDate(java.time.LocalDate.now());

			stats.put("totalEmployees", total);
			stats.put("activeEmployees", active);
			stats.put("pendingLeaves", pendingLeaves);
			stats.put("onLeaveToday", onLeaveToday.size());
			stats.put("onLeaveEmployees", onLeaveToday.stream()
					.map(l -> {
						java.util.Map<String, Object> empMap = new java.util.HashMap<>();
						empMap.put("id", l.getEmployee().getId());
						empMap.put("name", l.getEmployee().getName());
						return empMap;
					})
					.collect(java.util.stream.Collectors.toList()));
			
			// REAL-TIME ATTENDANCE RATE: (Check-ins today / Active Employees)
			long checkedInToday = attendanceRepo.findByDate(java.time.LocalDate.now()).size();
			String rate = active > 0 ? ((checkedInToday * 100) / active) + "%" : "0%";
			stats.put("attendanceRate", rate);

			// Global Activities (Admin View)
			employees.stream()
				.sorted((e1, e2) -> e2.getJoiningDate().compareTo(e1.getJoiningDate()))
				.limit(3)
				.forEach(e -> {
					java.util.Map<String, String> act = new java.util.HashMap<>();
					act.put("text", "New hire: " + e.getName() + " joined " + e.getDepartment());
					act.put("time", "Recent");
					act.put("type", "HIRE");
					activities.add(act);
				});

			leaveRepo.findAll().stream()
				.sorted((l1, l2) -> l2.getId().compareTo(l1.getId()))
				.limit(3)
				.forEach(l -> {
					java.util.Map<String, String> act = new java.util.HashMap<>();
					act.put("text", "Leave " + l.getStatus() + " for " + l.getEmployee().getName());
					act.put("time", l.getStartDate().toString());
					act.put("type", "LEAVE");
					activities.add(act);
				});
		} else {
			if (employee != null) {
				List<com.demo.entity.Attendance> myAttendance = attendanceRepo.findByEmployee(employee);
				long presentDays = myAttendance.size();
				long pendingLeaves = leaveRepo.findByEmployee(employee).stream()
						.filter(l -> "PENDING".equalsIgnoreCase(l.getStatus()))
						.count();
				
				stats.put("presentDays", presentDays);
				stats.put("leavesRemaining", 24 - leaveRepo.findByEmployee(employee).stream()
						.filter(l -> "APPROVED".equalsIgnoreCase(l.getStatus())).count());
				stats.put("upcomingHolidays", 2);
				
				// DYNAMIC PERFORMANCE SCORE: Based on average working hours
				double avgHours = myAttendance.stream()
						.mapToDouble(a -> a.getWorkingHours() != null ? a.getWorkingHours() : 0.0)
						.average().orElse(0.0);
				String score = avgHours >= 8.5 ? "A+" : avgHours >= 7.5 ? "A" : avgHours >= 6.0 ? "B" : "C";
				stats.put("performanceScore", score);

				// Personal Activities
				myAttendance.stream()
					.sorted((a1, a2) -> a2.getDate().compareTo(a1.getDate()))
					.limit(3)
					.forEach(a -> {
						java.util.Map<String, String> act = new java.util.HashMap<>();
						act.put("text", "Checked in at " + a.getCheckIn());
						act.put("time", a.getDate().toString());
						act.put("type", "CLOCK");
						activities.add(act);
					});
				
				leaveRepo.findByEmployee(employee).stream()
					.sorted((l1, l2) -> l2.getStartDate().compareTo(l1.getStartDate()))
					.limit(2)
					.forEach(l -> {
						java.util.Map<String, String> act = new java.util.HashMap<>();
						act.put("text", l.getType() + " leave request is " + l.getStatus());
						act.put("time", "Update");
						act.put("type", "LEAVE");
						activities.add(act);
					});
			} else {
				stats.put("presentDays", 0);
				stats.put("leavesRemaining", 0);
				stats.put("upcomingHolidays", 0);
				stats.put("performanceScore", "N/A");
			}
		}

		stats.put("recentActivities", activities);
		return ResponseEntity.ok(com.demo.dto.ApiResponse.success(stats, "Stats retrieved successfully"));
	}
}
