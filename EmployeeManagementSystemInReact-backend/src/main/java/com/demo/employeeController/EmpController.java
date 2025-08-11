package com.demo.employeeController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class EmpController {

	@Autowired
	EmployeeService serv;
	
	@PostMapping("/employee")
	public Employee postEmployee(@RequestBody Employee employee) {
		return serv.postEmployee(employee);
	}
	
	@GetMapping("/getEmployee")
	public List<Employee> getAllEmployees(){
		 return serv.getAllEmployee();
	}
	
	@DeleteMapping("/employee/{id}")
	public ResponseEntity<?> deleteEmployee(@PathVariable Long id){
	
		try{
			serv.deleteEmployee(id);
			return new ResponseEntity<>("Employee with id"+ id +"deleted successfully",HttpStatus.OK);
		}catch (EntityNotFoundException e) {
	        return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/employee/{id}")
	public ResponseEntity<?> getEmployee(@PathVariable long id){
		Employee emp=serv.getEmployee(id);
		if(emp==null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(emp);	
	}
	
	@PatchMapping("/employee/{id}")
     public ResponseEntity<?> updateEmployee(@RequestBody Employee employee ,@PathVariable Long id) {
		Employee updateEmployee=serv.updateEmployee(employee,id);
		 if(updateEmployee==null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		 return ResponseEntity.ok(updateEmployee);	
}	
	
}
