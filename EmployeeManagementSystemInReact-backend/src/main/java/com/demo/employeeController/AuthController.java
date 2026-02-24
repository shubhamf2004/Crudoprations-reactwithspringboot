package com.demo.employeeController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.LoginRequest;
import com.demo.employeeService.AuthService;
import com.demo.entity.User;
import com.demo.employeeRepository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService auth;

	@Autowired
	private UserRepository userRepo;
	
	@PostMapping("/signup")
	public ResponseEntity<com.demo.dto.ApiResponse<String>> register (@RequestBody User user) {
		System.out.println("Controller: Received signup request for email: " + user.getEmail());
		return ResponseEntity.ok(com.demo.dto.ApiResponse.success(auth.register(user), "Registration successful"));
	}
	
	@PostMapping("/login")
	public ResponseEntity<com.demo.dto.ApiResponse<?>> login(@RequestBody LoginRequest req){
		System.out.println("Controller: Received login request for email: " + req.getEmail());
		String token = auth.login(req.getEmail(),req.getPassword());
	   
		if(token == null) 
			return ResponseEntity.status(401).body(com.demo.dto.ApiResponse.error("Invalid Credentials", "AUTH_ERROR"));
		
		User user = userRepo.findByEmail(req.getEmail());
		System.out.println("Controller: Login successful for " + req.getEmail() + " with role: " + user.getRole());
		
		com.demo.dto.LoginResponse response = new com.demo.dto.LoginResponse(user.getId(), token, req.getEmail(), user.getUsername(), user.getRole());
		return ResponseEntity.ok(com.demo.dto.ApiResponse.success(response, "Login successful"));
	}

}
