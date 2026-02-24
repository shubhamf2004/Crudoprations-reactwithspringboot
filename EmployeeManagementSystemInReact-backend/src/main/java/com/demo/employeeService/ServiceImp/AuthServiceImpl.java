package com.demo.employeeService.ServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.demo.employeeRepository.UserRepository;
import com.demo.employeeService.AuthService;
import com.demo.entity.User;
import com.demo.util.JwtTokenProvider;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtTokenProvider jwtProvider;

    @Autowired
    private com.demo.employeeRepository.EmployeeRepository employeeRepo;

    @Override
    public String register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        
        
        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "ROLE_USER";
        } else {
            role = role.trim().toUpperCase();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
        }
        user.setRole(role);
        
        try {
            repo.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        // Also create a basic Employee profile for the new user
        if (employeeRepo.findByEmail(user.getEmail()).isEmpty()) {
            com.demo.entity.Employee emp = new com.demo.entity.Employee();
            emp.setName(user.getUsername());
            emp.setEmail(user.getEmail());
            // Create active employee record
            emp.setStatus("ACTIVE");            emp.setJoiningDate(java.time.LocalDate.now());
            employeeRepo.save(emp);
        }

        return "User Registered successfully";
    }

    @Override
    public String login(String email, String password) {
        User user = repo.findByEmail(email);

        if (user == null) {
            return null;
        }

        boolean matches = encoder.matches(password, user.getPassword());
        if (!matches) {
            return null;
        }

        return jwtProvider.generateToken(email);
    }

}
