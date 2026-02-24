package com.demo.employeeRepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.User;

public interface UserRepository extends JpaRepository<User,Long> {
	 User findByEmail(String email);
}
