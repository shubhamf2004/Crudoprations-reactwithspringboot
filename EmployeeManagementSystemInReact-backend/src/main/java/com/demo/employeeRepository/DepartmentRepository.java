package com.demo.employeeRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department,Long> {

}
